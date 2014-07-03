/* ***********************************************
 * Connects the user inferface for updating teh settings of a project with the AJAX backend.
 * Sends requests using admin.control.ajax and handles the responses by update the interface
 * accordingly.
 *
 * @author Oliver Roick (http://github.com/oliverroick)
 * @version 0.1
 * ***********************************************/

$(function () {
	'use strict';

	var messages = new Ui.MessageDisplay();

	// Read the IDs from the body's attributes
	var projectId = $('body').attr('data-project-id');
	var observationtypeId = $('body').attr('data-observationtype-id');
	var fieldId = $('body').attr('data-field-id');
	var viewId = $('body').attr('data-view-id');
	var groupId = $('body').attr('data-group-id');
	var appId = $('body').attr('data-app-id');

	/*
	The url to send the requests to update the object
	*/
	var url = 'projects/' + projectId;

	/*
	The key to access the result object in the response
	*/
	var resultAccessor = 'project';

	/*
	Human readable name, to be used in message displays
	*/
	var name = 'project';

	// Setting parameters
	if (projectId && observationtypeId) {
		url += '/observationtypes/' + observationtypeId;
		name = 'contribution type';
	}
	if (projectId && observationtypeId && fieldId) {
		url += '/fields/' + fieldId;
		name = 'field';
	}
	if (projectId && viewId) {
		url += '/views/' + viewId;
		name = 'map';
	}
	if (projectId && groupId) {
		url += '/usergroups/' + groupId;
		name = 'user group';
	}
	if (appId) {
		url = 'apps/' + appId;
		name = 'application';
	}

	/**
	 * Updates the user interface after the response is received. Resets
	 * submit buttons in modals and hides all modals.
	 * Toggles the respective panel (active or public) if the request has
	 * been successful.
	 * @param  {String} toToggle Css class part to toogle the display after update
	 */
	function updateUi(toToggle) {
		$('button[name="confirm"]').button('reset');
		$('.modal').modal('hide');
		if (toToggle) {
			$('.toggle-' + toToggle).toggleClass('hidden');
		}
	}

	/**
	 * Returns the parent element of the panel for message display.
	 * @param  {String} id HTML element id or class name
	 */
	function getMessageTarget(id) {
		return $('.toggle-' + id).parent();
	}

	/**
	 * Deletes the project.
	 */
	function del() {

		/**
		 * Handles the response after the item has been deleted successfully.
		 */
		function handleSuccess() {
			var link = '<a href="/admin/dashboard" class="alert-link">Return to dashboard</a>';
			if (projectId && viewId) { link = '<a href="/admin/projects/' + projectId + '" class="alert-link">Return to project</a>'; }
			if (projectId && groupId) { link = '<a href="/admin/projects/' + projectId + '/" class="alert-link">Return to project</a>'; }

			updateUi();
			$('.row').remove();
			$('hr').remove();
			$('.page-header').after('<div class="container"><div class="col-md-12"><div class="alert alert-success">The ' + name + ' has now been deleted. ' + link + '.</div></div></div>');
		}

		/**
		 * Handles the response after the deletion of the item failed.
		 * @param  {Object} response JSON object of the response
		 */
		function handleError(response) {
			updateUi();
			messages.showPanelError(getMessageTarget(event), 'An error occurred while updating the ' + name + '. ' + response.responseJSON.error);
		}

		Control.Ajax.del(url, handleSuccess, handleError);
	}

	/**
	 * Handles the click on the confirm button and updates the status to either active or inactive.
	 * @param  {Event} event The click event fired by the button.
	 */
	function updateActive(event) {
		/**
		 * Handles the respionse after the status of the item has been updated successfully.
		 * @param  {Object} response JSON object of the response
		 */
		function handleSuccess(response) {
			updateUi('active');
			messages.showPanelSuccess(getMessageTarget('active'), 'The ' + name + ' is now ' + response.status + '.');
		}

		/**
		 * Handles the respionse after the update of the item failed.
		 * @param  {Object} response JSON object of the response
		 */
		function handleError(response) {
			updateUi();
			messages.showPanelError(getMessageTarget('active'), 'An error occurred while updating the ' + name + '. ' + response.responseJSON.error);
		}
		Control.Ajax.put(url, handleSuccess, handleError, {'status': event.target.value});
	}

	/**
	 * Handles the click on the confirm button and updates the status to either private or public.
	 * @param  {Event} event The click event fired by the button.
	 */
	function updatePrivate(event) {
		var isPrivate = (event.target.value === 'true');

		/**
		 * Handles the respionse after the status of the item has been updated successfully.
		 * @param  {Object} response JSON object of the response
		 */
		function handleSuccess(response) {
			updateUi('private');
			messages.showPanelSuccess(getMessageTarget('private'), 'The ' + name + ' is now ' + (response.isprivate ? 'private' : 'public') + '.');
		}

		/**
		 * Handles the respionse after the update of the item failed.
		 * @param  {Object} response JSON object of the response
		 */
		function handleError(response) {
			updateUi();
			messages.showPanelError(getMessageTarget('private'), 'An error occurred while updating the ' + name + '. ' + response.responseJSON.error);
		}

		Control.Ajax.put(url, handleSuccess, handleError, {'isprivate': isPrivate});
	}

	/**
	 * Handles the click on the confirm button and updates the field status to either mandatory or optional.
	 * @param  {Event} event The click event fired by the button.
	 */
	function updateRequired(event) {
		var isRequired = (event.target.value === 'true');

		/**
		 * Handles the response after the status of the field has been updated successfully.
		 * @param  {Object} response JSON object of the response
		 */
		function handleSuccess(response) {
			updateUi('mandatory');
			messages.showPanelSuccess(getMessageTarget('mandatory'), 'The ' + name + ' is now ' + (response.required ? 'mandatory' : 'optional') + '.');
		}

		/**
		 * Handles the response after the update of the field failed.
		 * @param  {Object} response JSON object of the response
		 */
		function handleError(response) {
			updateUi();
			messages.showPanelError(getMessageTarget('mandatory'), 'An error occurred while updating the ' + name + '. ' + response.responseJSON.error);
		}

		Control.Ajax.put(url, handleSuccess, handleError, {'required': isRequired});
	}

	function updateEveryoneContributes(event) {
		var checkbox = $(event.target);
		function handleError(response) {
			messages.showInlineError(getMessageTarget('everyone_contributes'), 'An error occurred while updating the ' + name + '. ' + response.responseJSON.error);
			checkbox.prop('checked', !checkbox.prop('checked'));
		}
		
		Control.Ajax.put(url, null, handleError, {'everyone_contributes': checkbox.prop('checked')});
	}

	$('#delete-confirm button[name="confirm"]').click(del);
	$('#make-inactive-confirm button[name="confirm"]').click(updateActive);
	$('#make-active-confirm button[name="confirm"]').click(updateActive);
	$('#make-public-confirm button[name="confirm"]').click(updatePrivate);
	$('#make-private-confirm button[name="confirm"]').click(updatePrivate);
	$('button[name="toogleMandatory"]').click(updateRequired);
	$('input[name="everyone_contributes"]').change(updateEveryoneContributes);
});
"""Core adapters."""

from django.core.urlresolvers import reverse

from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    """Adapter for social accounts."""

    def get_connect_redirect_url(self, request, socialaccount):
        """Return URL after successfullu connecting a social account."""
        assert request.user.is_authenticated()
        url = reverse('admin:userprofile')
        return url

import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        logger.exception('Unhandled API exception', exc_info=exc)
        return Response(
            {
                'error': 'Error interno del servidor.',
                'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if isinstance(response.data, dict):
        if 'detail' in response.data and 'error' not in response.data:
            response.data = {
                'error': str(response.data['detail']),
                'status_code': response.status_code,
            }
        return response

    response.data = {
        'error': 'Solicitud no procesable.',
        'details': response.data,
        'status_code': response.status_code,
    }
    return response
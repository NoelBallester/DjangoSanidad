import random
import string
from collections import OrderedDict
from django import forms
from django.core.exceptions import ValidationError
from django.db.utils import OperationalError, ProgrammingError
from api.models import Cassette, Muestra, Imagen, Citologia, MuestraCitologia, ImagenCitologia, Necropsia, MuestraNecropsia, ImagenNecropsia, Tecnico, Hematologia, MuestraHematologia, ImagenHematologia, CatalogoOpcion, Tubo, MuestraTubo, Microbiologia, MuestraMicrobiologia, InformeResultado


def _distinct_non_empty_values(model, field_name):
    try:
        values = model.objects.order_by(field_name).values_list(field_name, flat=True).distinct()
        return [value for value in values if value]
    except (OperationalError, ProgrammingError):
        return []


def _simple_choices_from_values(empty_label, values):
    seen = set()
    options = [('', empty_label)]
    for value in values:
        if value in seen:
            continue
        seen.add(value)
        options.append((value, value))
    return options


def _append_choice_if_missing(choices, value):
    if not value:
        return choices

    normalized = list(choices)
    existing_values = set()
    for choice_value, _choice_label in normalized:
        if isinstance(choice_label := _choice_label, (list, tuple)):
            existing_values.update(item_value for item_value, _item_label in choice_label)
        else:
            existing_values.add(choice_value)

    if value not in existing_values:
        normalized.append((value, value))

    return normalized


def _fallback_catalog_values(tipo):
    if tipo == CatalogoOpcion.TIPO_ORGANO:
        values = []
        for model in (Cassette, Citologia, Necropsia, Hematologia, Tubo, Microbiologia):
            values.extend(_distinct_non_empty_values(model, 'organo'))
        return values

    if tipo == CatalogoOpcion.TIPO_TINCION:
        values = []
        for model in (Muestra, MuestraCitologia, MuestraNecropsia, MuestraHematologia, MuestraTubo, MuestraMicrobiologia):
            values.extend(_distinct_non_empty_values(model, 'tincion'))
        values.extend(_distinct_non_empty_values(InformeResultado, 'tincion'))
        return values

    if tipo == CatalogoOpcion.TIPO_CITOLOGIA:
        return _distinct_non_empty_values(Citologia, 'tipo_citologia')

    if tipo == CatalogoOpcion.TIPO_AUTOPSIA:
        return _distinct_non_empty_values(Necropsia, 'tipo_necropsia')

    return []


def _catalog_simple_choices(tipo, empty_label):
    try:
        qs = CatalogoOpcion.objects.filter(tipo=tipo, activo=True).order_by('orden', 'valor')
        valores = [item.valor for item in qs if item.valor]
    except (OperationalError, ProgrammingError):
        valores = []

    if not valores:
        valores = _fallback_catalog_values(tipo)

    return _simple_choices_from_values(empty_label, valores)


def _catalog_organo_choices():
    try:
        qs = CatalogoOpcion.objects.filter(
            tipo=CatalogoOpcion.TIPO_ORGANO,
            activo=True,
        ).order_by('orden', 'valor')

        grouped = OrderedDict()
        singles = []
        for item in qs:
            if item.categoria:
                grouped.setdefault(item.categoria, []).append((item.valor, item.valor))
            elif item.valor:
                singles.append((item.valor, item.valor))

        choices = [('', 'Seleccionar Órgano')]
        for categoria, values in grouped.items():
            choices.append((categoria, values))
        choices.extend(singles)

        if len(choices) > 1:
            return choices
    except (OperationalError, ProgrammingError):
        pass

    return _simple_choices_from_values(
        'Seleccionar Órgano',
        _fallback_catalog_values(CatalogoOpcion.TIPO_ORGANO),
    )


def _qr(prefix):
    return prefix + ''.join(random.choices(string.ascii_letters + string.digits, k=12))


MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024
DOC_ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.odt', '.jpg', '.jpeg', '.png', '.gif'}
DOC_ALLOWED_CONTENT_TYPES = {
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/octet-stream',
}
IMAGE_ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
IMAGE_ALLOWED_CONTENT_TYPES = {
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/octet-stream',
}


def _validate_uploaded_file(uploaded_file, allowed_extensions, allowed_content_types, field_label):
    if not uploaded_file:
        return uploaded_file

    file_name = (uploaded_file.name or '').lower()
    extension = '.' + file_name.rsplit('.', 1)[-1] if '.' in file_name else ''
    if extension not in allowed_extensions:
        raise ValidationError(f'{field_label}: extensión no permitida ({extension or "sin extensión"}).')

    if uploaded_file.size and uploaded_file.size > MAX_UPLOAD_SIZE_BYTES:
        raise ValidationError(f'{field_label}: tamaño máximo permitido de 10 MB.')

    content_type = (getattr(uploaded_file, 'content_type', '') or '').lower()
    if content_type and content_type not in allowed_content_types:
        raise ValidationError(f'{field_label}: tipo de archivo no permitido ({content_type}).')

    return uploaded_file


class CassetteForm(forms.ModelForm):
    organo = forms.ChoiceField(choices=())
    volante_peticion = forms.FileField(required=False, widget=forms.FileInput(
        attrs={'class': 'form-control blue__color', 'accept': '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif'}))

    class Meta:
        model = Cassette
        fields = ['cassette', 'fecha', 'descripcion', 'caracteristicas', 'observaciones',
                  'descripcion_microscopica', 'diagnostico_final', 'patologo_responsable', 'organo',
                  'informacion_clinica', 'volante_peticion']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'descripcion': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'caracteristicas': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'diagnostico_final': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'descripcion_microscopica': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'informacion_clinica': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['organo'].choices = _catalog_organo_choices()
        for name, field in self.fields.items():
            if name not in ('fecha', 'descripcion', 'caracteristicas', 'observaciones',
                            'descripcion_microscopica', 'diagnostico_final', 'organo', 'informacion_clinica'):
                field.widget.attrs.setdefault('class', 'form-control blue__color')

    def save(self, commit=True, tecnico=None):
        obj = super().save(commit=False)
        if not obj.qr_casette:
            obj.qr_casette = _qr('--c--')
        if tecnico:
            obj.tecnico = tecnico
        if commit:
            obj.save()
        return obj

    def clean_volante_peticion(self):
        return _validate_uploaded_file(
            self.cleaned_data.get('volante_peticion'),
            DOC_ALLOWED_EXTENSIONS,
            DOC_ALLOWED_CONTENT_TYPES,
            'Volante de petición',
        )


class CitologiaForm(forms.ModelForm):
    organo = forms.ChoiceField(choices=())
    tipo_citologia = forms.ChoiceField(choices=())
    volante_peticion = forms.FileField(required=False, widget=forms.FileInput(
        attrs={'class': 'form-control blue__color', 'accept': '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif'}))

    class Meta:
        model = Citologia
        fields = ['citologia', 'tipo_citologia', 'fecha', 'descripcion', 'caracteristicas',
                  'observaciones', 'organo', 'volante_peticion', 'diagnostico_final']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'caracteristicas': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'diagnostico_final': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['organo'].choices = _catalog_organo_choices()
        self.fields['tipo_citologia'].choices = _catalog_simple_choices(
            CatalogoOpcion.TIPO_CITOLOGIA,
            'Tipo de muestra',
        )
        for name, field in self.fields.items():
            if name not in ('fecha', 'caracteristicas', 'observaciones', 'organo', 'tipo_citologia'):
                field.widget.attrs.setdefault('class', 'form-control blue__color')

    def save(self, commit=True, tecnico=None):
        obj = super().save(commit=False)
        if not obj.qr_citologia:
            obj.qr_citologia = _qr('--cit--')
        if tecnico:
            obj.tecnico = tecnico
        if commit:
            obj.save()
        return obj

    def clean_volante_peticion(self):
        return _validate_uploaded_file(
            self.cleaned_data.get('volante_peticion'),
            DOC_ALLOWED_EXTENSIONS,
            DOC_ALLOWED_CONTENT_TYPES,
            'Volante de petición',
        )


class MuestraForm(forms.ModelForm):
    tincion = forms.ChoiceField(choices=())

    class Meta:
        model = Muestra
        fields = ['descripcion', 'fecha', 'tincion', 'observaciones']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['tincion'].choices = _catalog_simple_choices(
            CatalogoOpcion.TIPO_TINCION,
            'Seleccionar Validación',
        )
        for name, field in self.fields.items():
            if name not in ('fecha', 'observaciones', 'tincion'):
                field.widget.attrs.setdefault('class', 'form-control blue__color')

    def save(self, commit=True, cassette=None):
        obj = super().save(commit=False)
        if not obj.qr_muestra:
            obj.qr_muestra = _qr('--m--')
        if cassette:
            obj.cassette = cassette
        if commit:
            obj.save()
        return obj


class MuestraCitologiaForm(forms.ModelForm):
    tincion = forms.ChoiceField(choices=())

    class Meta:
        model = MuestraCitologia
        fields = ['descripcion', 'fecha', 'tincion', 'observaciones']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['fecha'].required = False
        self.fields['tincion'].choices = _catalog_simple_choices(
            CatalogoOpcion.TIPO_TINCION,
            'Seleccionar Validación',
        )
        for name, field in self.fields.items():
            if name not in ('fecha', 'observaciones', 'tincion'):
                field.widget.attrs.setdefault('class', 'form-control blue__color')

    def save(self, commit=True, citologia=None):
        obj = super().save(commit=False)
        if not obj.qr_muestra:
            obj.qr_muestra = _qr('--mc--')
        if citologia:
            obj.citologia = citologia
        if commit:
            obj.save()
        return obj


class NecropsiaForm(forms.ModelForm):
    organo = forms.ChoiceField(choices=())
    tipo_necropsia = forms.ChoiceField(choices=())
    volante_peticion = forms.FileField(required=False, widget=forms.FileInput(
        attrs={'class': 'form-control blue__color', 'accept': '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif'}))

    class Meta:
        model = Necropsia
        fields = ['necropsia', 'tipo_necropsia', 'fecha', 'descripcion', 'caracteristicas',
                  'fenomenos_cadavericos', 'examen_externo_cadaver', 'datos_muerte',
                  'observaciones', 'organo', 'volante_peticion', 'diagnostico_final',
                  'informacion_clinica', 'descripcion_microscopica']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'caracteristicas': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'fenomenos_cadavericos': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'examen_externo_cadaver': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'datos_muerte': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'diagnostico_final': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'informacion_clinica': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'descripcion_microscopica': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['organo'].choices = _catalog_organo_choices()
        self.fields['tipo_necropsia'].choices = _catalog_simple_choices(
            CatalogoOpcion.TIPO_AUTOPSIA,
            'Seleccionar tipo de autopsia',
        )
        for name, field in self.fields.items():
            if name not in (
                'fecha',
                'caracteristicas',
                'fenomenos_cadavericos',
                'examen_externo_cadaver',
                'datos_muerte',
                'observaciones',
                'organo',
                'tipo_necropsia',
            ):
                field.widget.attrs.setdefault('class', 'form-control blue__color')

    def clean_volante_peticion(self):
        return _validate_uploaded_file(
            self.cleaned_data.get('volante_peticion'),
            DOC_ALLOWED_EXTENSIONS,
            DOC_ALLOWED_CONTENT_TYPES,
            'Volante de petición',
        )

    def save(self, commit=True, tecnico=None):
        obj = super().save(commit=False)
        if not obj.qr_necropsia:
            obj.qr_necropsia = _qr('--nec--')
        if tecnico:
            obj.tecnico = tecnico
        if commit:
            obj.save()
        return obj


class MuestraNecropsiaForm(forms.ModelForm):
    tincion = forms.ChoiceField(choices=())

    class Meta:
        model = MuestraNecropsia
        fields = [
            'descripcion',
            'fecha',
            'examen_interno_cadaver',
            'tecnica_apertura',
            'datos_relevantes_region',
            'toma_muestras',
            'tincion',
            'observaciones',
        ]
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'examen_interno_cadaver': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color'}),
            'datos_relevantes_region': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color'}),
            'toma_muestras': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['fecha'].required = False
        tincion_choices = _catalog_simple_choices(
            CatalogoOpcion.TIPO_TINCION,
            'Seleccionar Validación',
        )
        current_tincion = (
            self.data.get(self.add_prefix('tincion'))
            or self.initial.get('tincion')
            or getattr(self.instance, 'tincion', '')
        )
        self.fields['tincion'].choices = _append_choice_if_missing(tincion_choices, current_tincion)
        for name, field in self.fields.items():
            if name not in (
                'fecha',
                'examen_interno_cadaver',
                'datos_relevantes_region',
                'toma_muestras',
                'observaciones',
                'tincion',
            ):
                field.widget.attrs.setdefault('class', 'form-control blue__color')

    def save(self, commit=True, necropsia=None):
        obj = super().save(commit=False)
        if not obj.qr_muestra:
            obj.qr_muestra = _qr('--mn--')
        if necropsia:
            obj.necropsia = necropsia
        if commit:
            obj.save()
        return obj


class InformeForm(forms.Form):
    informe_descripcion = forms.CharField(required=False,
        widget=forms.TextInput(attrs={'class': 'form-control blue__color bg-light'}))
    informe_fecha = forms.DateField(required=False,
        widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color bg-light'}))
    informe_tincion = forms.ChoiceField(choices=(), required=False,
        widget=forms.Select(attrs={'class': 'form-select blue__color bg-light'}))
    informe_observaciones = forms.CharField(required=False,
        widget=forms.Textarea(attrs={'rows': 3, 'class': 'form-control blue__color bg-light'}))
    informe_imagen = forms.FileField(required=False,
        widget=forms.FileInput(attrs={'class': 'form-control blue__color bg-light',
                                      'accept': '.pdf,.doc,.docx,.odt,.jpg,.jpeg,.png,.gif'}))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['informe_tincion'].choices = _catalog_simple_choices(
            CatalogoOpcion.TIPO_TINCION,
            'Seleccionar Validación',
        )

    def clean_informe_imagen(self):
        return _validate_uploaded_file(
            self.cleaned_data.get('informe_imagen'),
            DOC_ALLOWED_EXTENSIONS,
            DOC_ALLOWED_CONTENT_TYPES,
            'Informe',
        )


class ImagenForm(forms.ModelForm):
    class Meta:
        model = Imagen
        fields = ['imagen']


class ImagenCitologiaForm(forms.ModelForm):
    class Meta:
        model = ImagenCitologia
        fields = ['imagen']


class ImagenNecropsiaForm(forms.ModelForm):
    class Meta:
        model = ImagenNecropsia
        fields = ['imagen']


class HematologiaForm(forms.ModelForm):
    organo = forms.ChoiceField(choices=())
    volante_peticion = forms.FileField(required=False, widget=forms.FileInput(
        attrs={'class': 'form-control blue__color', 'accept': '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif'}))

    class Meta:
        model = Hematologia
        fields = ['hematologia', 'fecha', 'descripcion', 'caracteristicas', 'observaciones',
                  'descripcion_microscopica', 'diagnostico_final', 'patologo_responsable', 'organo',
                  'volante_peticion']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'descripcion': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'caracteristicas': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'diagnostico_final': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'descripcion_microscopica': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['organo'].choices = _catalog_organo_choices()
        for name, field in self.fields.items():
            if name not in ('fecha', 'descripcion', 'caracteristicas', 'observaciones',
                            'descripcion_microscopica', 'diagnostico_final', 'organo'):
                field.widget.attrs.setdefault('class', 'form-control blue__color')

    def save(self, commit=True, tecnico=None):
        obj = super().save(commit=False)
        if not obj.qr_hematologia:
            obj.qr_hematologia = _qr('--h--')
        if tecnico:
            obj.tecnico = tecnico
        if commit:
            obj.save()
        return obj

    def clean_volante_peticion(self):
        return _validate_uploaded_file(
            self.cleaned_data.get('volante_peticion'),
            DOC_ALLOWED_EXTENSIONS,
            DOC_ALLOWED_CONTENT_TYPES,
            'Volante de petición',
        )


class MuestraHematologiaForm(forms.ModelForm):
    tincion = forms.ChoiceField(choices=())

    class Meta:
        model = MuestraHematologia
        fields = ['descripcion', 'fecha', 'tincion', 'observaciones']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['fecha'].required = False
        self.fields['tincion'].choices = _catalog_simple_choices(
            CatalogoOpcion.TIPO_TINCION,
            'Seleccionar Validación',
        )
        for name, field in self.fields.items():
            if name not in ('fecha', 'observaciones', 'tincion'):
                field.widget.attrs.setdefault('class', 'form-control blue__color')

    def save(self, commit=True, hematologia=None):
        obj = super().save(commit=False)
        if not obj.qr_muestra:
            obj.qr_muestra = _qr('--mh--')
        if hematologia:
            obj.hematologia = hematologia
        if commit:
            obj.save()
        return obj


class ImagenHematologiaForm(forms.Form):
    imagen = forms.FileField(required=False, widget=forms.FileInput(attrs={'class': 'form-control blue__color', 'accept': '.jpg,.jpeg,.png,.gif'}))

    def clean_imagen(self):
        return _validate_uploaded_file(
            self.cleaned_data.get('imagen'),
            IMAGE_ALLOWED_EXTENSIONS,
            IMAGE_ALLOWED_CONTENT_TYPES,
            'Imagen',
        )




_W = {'class': 'form-control blue__color'}
_S = {'class': 'form-select blue__color'}


class TecnicoForm(forms.ModelForm):
    password = forms.CharField(
        required=False,
        label='Contraseña',
        widget=forms.PasswordInput(attrs={**_W, 'autocomplete': 'new-password',
                                          'placeholder': 'Dejar vacío para no cambiar'}),
    )

    class Meta:
        model = Tecnico
        fields = ['username', 'nombre', 'apellidos', 'email', 'centro', 'rol', 'is_staff', 'password']
        widgets = {
            'username':  forms.TextInput(attrs=_W),
            'nombre':    forms.TextInput(attrs=_W),
            'apellidos': forms.TextInput(attrs=_W),
            'email':     forms.EmailInput(attrs=_W),
            'centro':    forms.TextInput(attrs={**_W, 'placeholder': 'Nombre del centro (opcional)'}),
            'rol':       forms.Select(attrs=_W),
            'is_staff':  forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
        labels = {
            'nombre':    'Nombre',
            'apellidos': 'Apellidos',
            'rol':       'Tipo de usuario',
            'is_staff':  'Administrador',
        }

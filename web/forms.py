import random
import string
from django import forms
from django.core.exceptions import ValidationError
from api.models import Cassette, Muestra, Imagen, Citologia, MuestraCitologia, ImagenCitologia, Necropsia, MuestraNecropsia, ImagenNecropsia, Tecnico, Hematologia, MuestraHematologia, ImagenHematologia


ORGANOS = [
    ('', 'Seleccionar Órgano'),
    ('Sistema Nervioso', [
        ('Encéfalo', 'Encéfalo'), ('Médula Espinal', 'Médula Espinal'),
        ('Nervio', 'Nervio'), ('Ganglio Nervios', 'Ganglio Nervios'),
    ]),
    ('Tegumento', [
        ('Piel', 'Piel'), ('Uña', 'Uña'), ('Pelo', 'Pelo'),
    ]),
    ('Cardiovascular', [
        ('Corazón', 'Corazón'), ('Venas', 'Venas'), ('Arteria', 'Arteria'),
        ('Líquido Pericárdico', 'Líquido Pericárdico'),
    ]),
    ('Linfático', [
        ('Ganglio Linfático', 'Ganglio Linfático'), ('Timo', 'Timo'), ('Bazo', 'Bazo'),
        ('Ganglio cervical', 'Ganglio cervical'), ('Ganglio axilar', 'Ganglio axilar'),
        ('Ganglio inguinal', 'Ganglio inguinal'), ('Médula ósea', 'Médula ósea'),
        ('Sangre periférica', 'Sangre periférica'),
    ]),
    ('Endocrino', [
        ('Hipófisis', 'Hipófisis'), ('Glándula Tiroides', 'Glándula Tiroides'),
        ('Glándulas Paratiroides', 'Glándulas Paratiroides'),
        ('Glándulas Suprarrenales', 'Glándulas Suprarrenales'), ('Páncreas', 'Páncreas'),
    ]),
    ('Respiratorio', [
        ('Fosa Nasal', 'Fosa Nasal'), ('Faringe', 'Faringe'), ('Laringe', 'Laringe'),
        ('Tráquea', 'Tráquea'), ('Bronquio', 'Bronquio'), ('Pulmón', 'Pulmón'),
        ('Líquido Pleural', 'Líquido Pleural'),
    ]),
    ('Digestivo', [
        ('Boca', 'Boca'), ('Cavidad oral', 'Cavidad oral'), ('Lengua', 'Lengua'), ('Glándula Salival', 'Glándula Salival'),
        ('Esófago', 'Esófago'), ('Estómago', 'Estómago'), ('Hígado', 'Hígado'),
        ('Vesícula Biliar', 'Vesícula Biliar'), ('Páncreas', 'Páncreas'),
        ('Int. Delgado', 'Int. Delgado'), ('Int. Grueso', 'Int. Grueso'),
        ('Ciego', 'Ciego'), ('Apéndice', 'Apéndice'), ('Recto', 'Recto'), ('Ano', 'Ano'),
        ('Líquido Peritoneal', 'Líquido Peritoneal'),
    ]),
    ('Excretor Urinario', [
        ('Riñón', 'Riñón'), ('Pelvis Renal', 'Pelvis Renal'), ('Uréter', 'Uréter'),
        ('Vejiga Urinaria', 'Vejiga Urinaria'), ('Uretra', 'Uretra'),
    ]),
    ('Reproductor Masculino', [
        ('Testículo', 'Testículo'),
    ]),
    ('Reproductor Femenino', [
        ('Mama', 'Mama'),
        ('Ovario', 'Ovario'), ('Trompa de Falopio', 'Trompa de Falopio'),
        ('Útero', 'Útero'), ('Vagina', 'Vagina'), ('Vulva', 'Vulva'),
        ('Cuerpo de Útero', 'Cuerpo de Útero'),
        ('Cuello de Útero', 'Cuello de Útero'),
        ('Cavidad Pélvica', 'Cavidad Pélvica'),
    ]),
    ('Locomotor', [
        ('Hueso', 'Hueso'), ('Músculo Esquelético', 'Músculo Esquelético'),
        ('Líquido Sinovial', 'Líquido Sinovial'),
    ]),
    ('Otros', 'Otros'),
]

TINCIONES = [
    ('', 'Seleccionar Validación'),
    ('Hematoxilina Eosina (HE)', 'Hematoxilina Eosina (HE)'),
    ('Giemsa', 'Giemsa'), ('Gram', 'Gram'), ('Azul de Metileno', 'Azul de Metileno'),
    ('Papanicolau', 'Papanicolau'), ('Wright', 'Wright'), ('Ziehl-Neelsen', 'Ziehl-Neelsen'),
    ('Tricrómico', 'Tricrómico'), ('Orceína', 'Orceína'), ('P.A.S', 'P.A.S'), ('Otros', 'Otros'),
]

TIPOS_CITOLOGIA = [
    ('', 'Tipo de muestra'),
    ('Improntas', 'Improntas'),
    ('Punción-aspiración', 'Punción-aspiración'),
    ('Esputo', 'Esputo'),
    ('Líquido pleural', 'Líquido pleural'),
    ('Líquido ascítico', 'Líquido ascítico'),
    ('Líquido pericárdico', 'Líquido pericárdico'),
    ('Saliva', 'Saliva'),
    ('Contenido quístico', 'Contenido quístico'),
    ('Raspados', 'Raspados'),
    ('Orina', 'Orina'),
    ('Cepillado', 'Cepillado'),
    ('Citología respiratoria (BAS y BAL)', 'Citología respiratoria (BAS y BAL)'),
    ('Secreción mamaria', 'Secreción mamaria'),
    ('Muestra vulvar', 'Muestra vulvar'),
    ('Muestra endometrial', 'Muestra endometrial'),
]

TIPOS_AUTOPSIA = [
    ('', 'Seleccionar tipo de autopsia'),
    ('Clínica', 'Clinica'),
    ('Médico-legal', 'Medico-legal'),
    ('Forense', 'Forense'),
    ('Anatomopatológica', 'Anatomopatologica'),
    ('Perinatal', 'Perinatal'),
    ('Psicológica', 'Psicologica'),
    ('Verbal', 'Verbal'),
    ('Virtual', 'Virtual'),
    ('Otros', 'Otros'),
]

ANALISIS_INFORME = [
    ('', 'Seleccionar análisis'),
    ('Perfil hepático', 'Perfil hepático'),
    ('Perfil renal', 'Perfil renal'),
    ('Perfil lipídico', 'Perfil lipídico'),
    ('Glucosa', 'Glucosa'),
    ('Análisis de heces', 'Análisis de heces'),
    ('Análisis inmunológico', 'Análisis inmunológico'),
    ('Análisis citológico', 'Análisis citológico'),
    ('Análisis biopsias', 'Análisis biopsias'),
    ('Ionograma', 'Ionograma'),
    ('Gasometría', 'Gasometría'),
    ('Análisis de sangre', 'Análisis de sangre'),
    ('Otros', 'Otros'),
]


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
    organo = forms.ChoiceField(choices=ORGANOS)
    volante_peticion = forms.FileField(required=False, widget=forms.FileInput(
        attrs={'class': 'form-control blue__color', 'accept': '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif'}))

    class Meta:
        model = Cassette
        fields = ['cassette', 'fecha', 'descripcion', 'caracteristicas', 'observaciones',
                  'descripcion_microscopica', 'diagnostico_final', 'patologo_responsable', 'organo',
                  'informacion_clinica']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'descripcion': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'caracteristicas': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'diagnostico_final': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
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
    organo = forms.ChoiceField(choices=ORGANOS)
    tipo_citologia = forms.ChoiceField(choices=TIPOS_CITOLOGIA)
    volante_peticion = forms.FileField(required=False, widget=forms.FileInput(
        attrs={'class': 'form-control blue__color', 'accept': '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif'}))

    class Meta:
        model = Citologia
        fields = ['citologia', 'tipo_citologia', 'fecha', 'descripcion', 'caracteristicas',
                  'observaciones', 'organo']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'caracteristicas': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
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
    tincion = forms.ChoiceField(choices=TINCIONES)

    class Meta:
        model = Muestra
        fields = ['descripcion', 'fecha', 'tincion', 'observaciones']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
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
    tincion = forms.ChoiceField(choices=TINCIONES)

    class Meta:
        model = MuestraCitologia
        fields = ['descripcion', 'fecha', 'tincion', 'observaciones']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
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
    organo = forms.ChoiceField(choices=ORGANOS)
    tipo_necropsia = forms.ChoiceField(choices=TIPOS_AUTOPSIA)
    volante_peticion = forms.FileField(required=False, widget=forms.FileInput(
        attrs={'class': 'form-control blue__color', 'accept': '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif'}))

    class Meta:
        model = Necropsia
        fields = ['necropsia', 'tipo_necropsia', 'fecha', 'descripcion', 'caracteristicas',
                  'fenomenos_cadavericos', 'examen_externo_cadaver', 'datos_muerte',
                  'observaciones', 'organo']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'caracteristicas': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'fenomenos_cadavericos': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'examen_externo_cadaver': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'datos_muerte': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
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
    tincion = forms.ChoiceField(choices=TINCIONES)

    class Meta:
        model = MuestraNecropsia
        fields = [
            'descripcion',
            'fecha',
            'examen_interno_cadaver',
            'tecnica_apertura',
            'datos_relevantes_region',
            'tincion',
            'observaciones',
        ]
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'examen_interno_cadaver': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color'}),
            'datos_relevantes_region': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            if name not in (
                'fecha',
                'examen_interno_cadaver',
                'datos_relevantes_region',
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
    informe_tincion = forms.ChoiceField(choices=TINCIONES, required=False,
        widget=forms.Select(attrs={'class': 'form-select blue__color bg-light'}))
    informe_observaciones = forms.CharField(required=False,
        widget=forms.Textarea(attrs={'rows': 3, 'class': 'form-control blue__color bg-light'}))
    informe_imagen = forms.FileField(required=False,
        widget=forms.FileInput(attrs={'class': 'form-control blue__color bg-light',
                                      'accept': '.pdf,.doc,.docx,.odt,.jpg,.jpeg,.png,.gif'}))

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
    organo = forms.ChoiceField(choices=ORGANOS)
    volante_peticion = forms.FileField(required=False, widget=forms.FileInput(
        attrs={'class': 'form-control blue__color', 'accept': '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif'}))

    class Meta:
        model = Hematologia
        fields = ['hematologia', 'fecha', 'descripcion', 'caracteristicas', 'observaciones',
                  'descripcion_microscopica', 'diagnostico_final', 'patologo_responsable', 'organo']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'descripcion': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'caracteristicas': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'diagnostico_final': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
        }

    def clean_volante_peticion(self):
        file = self.cleaned_data.get('volante_peticion')
        if file:
            if file.size > 10 * 1024 * 1024:  # 10MB limit
                raise ValidationError("El archivo es demasiado grande (máx 10MB)")
            allowed_types = ['application/pdf', 'application/msword',
                             'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                             'image/jpeg', 'image/png', 'image/gif']
            if file.content_type not in allowed_types:
                raise ValidationError("Tipo de archivo no permitido")
        return file

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
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
    tincion = forms.ChoiceField(choices=TINCIONES)

    class Meta:
        model = MuestraHematologia
        fields = ['descripcion', 'fecha', 'tincion', 'observaciones']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
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
        fields = ['username', 'nombre', 'apellidos', 'email', 'centro', 'is_staff', 'password']
        widgets = {
            'username':  forms.TextInput(attrs=_W),
            'nombre':    forms.TextInput(attrs=_W),
            'apellidos': forms.TextInput(attrs=_W),
            'email':     forms.EmailInput(attrs=_W),
            'centro':    forms.TextInput(attrs={**_W, 'placeholder': 'Nombre del centro (opcional)'}),
            'is_staff':  forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }
        labels = {
            'nombre':    'Nombre',
            'apellidos': 'Apellidos',
            'is_staff':  'Administrador',
        }

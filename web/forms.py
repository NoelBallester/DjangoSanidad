import random
import string
from django import forms
from api.models import Cassette, Muestra, Imagen, Citologia, MuestraCitologia, ImagenCitologia, Tecnico, Hematologia, MuestraHematologia, ImagenHematologia


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
    ]),
    ('Linfático', [
        ('Ganglio Linfático', 'Ganglio Linfático'), ('Timo', 'Timo'), ('Bazo', 'Bazo'),
    ]),
    ('Endocrino', [
        ('Hipófisis', 'Hipófisis'), ('Glándula Tiroides', 'Glándula Tiroides'),
        ('Glándulas Paratiroides', 'Glándulas Paratiroides'),
        ('Glándulas Suprarrenales', 'Glándulas Suprarrenales'), ('Páncreas', 'Páncreas'),
    ]),
    ('Respiratorio', [
        ('Fosa Nasal', 'Fosa Nasal'), ('Faringe', 'Faringe'), ('Laringe', 'Laringe'),
        ('Tráquea', 'Tráquea'), ('Bronquio', 'Bronquio'), ('Pulmón', 'Pulmón'),
    ]),
    ('Digestivo', [
        ('Boca', 'Boca'), ('Lengua', 'Lengua'), ('Glándula Salival', 'Glándula Salival'),
        ('Esófago', 'Esófago'), ('Estómago', 'Estómago'), ('Hígado', 'Hígado'),
        ('Vesícula Biliar', 'Vesícula Biliar'), ('Páncreas', 'Páncreas'),
        ('Int. Delgado', 'Int. Delgado'), ('Int. Grueso', 'Int. Grueso'),
        ('Ciego', 'Ciego'), ('Apéndice', 'Apéndice'), ('Recto', 'Recto'), ('Ano', 'Ano'),
    ]),
    ('Excretor Urinario', [
        ('Riñón', 'Riñón'), ('Pelvis Renal', 'Pelvis Renal'), ('Uréter', 'Uréter'),
        ('Vejiga Urinaria', 'Vejiga Urinaria'), ('Uretra', 'Uretra'),
    ]),
    ('Reproductor Masculino', [
        ('Testículo', 'Testículo'),
    ]),
    ('Reproductor Femenino', [
        ('Ovario', 'Ovario'), ('Trompa de Falopio', 'Trompa de Falopio'),
        ('Útero', 'Útero'), ('Vagina', 'Vagina'), ('Vulva', 'Vulva'),
    ]),
    ('Locomotor', [
        ('Hueso', 'Hueso'), ('Músculo Esquelético', 'Músculo Esquelético'),
    ]),
    ('Otros', 'Otros'),
]

TINCIONES = [
    ('', 'Seleccionar Tinción'),
    ('Hematoxilina Eosina (HE)', 'Hematoxilina Eosina (HE)'),
    ('Giemsa', 'Giemsa'), ('Gram', 'Gram'), ('Azul de Metileno', 'Azul de Metileno'),
    ('Papanicolau', 'Papanicolau'), ('Wright', 'Wright'), ('Ziehl-Neelsen', 'Ziehl-Neelsen'),
    ('Tricrómica', 'Tricrómica'), ('Orceína', 'Orceína'), ('P.A.S', 'P.A.S'), ('Otros', 'Otros'),
]

TIPOS_CITOLOGIA = [
    ('', 'Tipo Citología'),
    ('PAAF', 'PAAF'),
    ('Citología Líquida', 'Citología Líquida'),
    ('Cervico Vaginal', 'Cervico Vaginal'),
    ('Derrames', 'Derrames'),
]


def _qr(prefix):
    return prefix + ''.join(random.choices(string.ascii_letters + string.digits, k=12))


class CassetteForm(forms.ModelForm):
    organo = forms.ChoiceField(choices=ORGANOS)

    class Meta:
        model = Cassette
        fields = ['cassette', 'fecha', 'descripcion', 'caracteristicas', 'observaciones',
                  'descripcion_microscopica', 'diagnostico_final', 'patologo_responsable', 'organo']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'descripcion': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'caracteristicas': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'descripcion_microscopica': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'diagnostico_final': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            if name not in ('fecha', 'descripcion', 'caracteristicas', 'observaciones',
                            'descripcion_microscopica', 'diagnostico_final', 'organo'):
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


class CitologiaForm(forms.ModelForm):
    organo = forms.ChoiceField(choices=ORGANOS)
    tipo_citologia = forms.ChoiceField(choices=TIPOS_CITOLOGIA)

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


class InformeForm(forms.Form):
    informe_descripcion = forms.CharField(required=False,
        widget=forms.TextInput(attrs={'class': 'form-control blue__color bg-light'}))
    informe_fecha = forms.DateField(required=False,
        widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color bg-light'}))
    informe_tincion = forms.ChoiceField(choices=TINCIONES, required=False,
        widget=forms.Select(attrs={'class': 'form-select blue__color bg-light'}))
    informe_observaciones = forms.CharField(required=False,
        widget=forms.Textarea(attrs={'rows': 3, 'class': 'form-control blue__color bg-light'}))
    informe_imagen = forms.ImageField(required=False,
        widget=forms.FileInput(attrs={'class': 'form-control blue__color bg-light',
                                      'accept': '.jpg,.jpeg,.png,.gif'}))


class ImagenForm(forms.ModelForm):
    class Meta:
        model = Imagen
        fields = ['imagen']


class ImagenCitologiaForm(forms.ModelForm):
    class Meta:
        model = ImagenCitologia
        fields = ['imagen']


class HematologiaForm(forms.ModelForm):
    organo = forms.ChoiceField(choices=ORGANOS)

    class Meta:
        model = Hematologia
        fields = ['hematologia', 'fecha', 'descripcion', 'caracteristicas', 'observaciones',
                  'descripcion_microscopica', 'diagnostico_final', 'patologo_responsable', 'organo']
        widgets = {
            'fecha': forms.DateInput(attrs={'type': 'date', 'class': 'form-control blue__color'}),
            'descripcion': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'caracteristicas': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'observaciones': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'descripcion_microscopica': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
            'diagnostico_final': forms.Textarea(attrs={'rows': 2, 'class': 'form-control blue__color textarea__text'}),
        }

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


class ImagenHematologiaForm(forms.ModelForm):
    class Meta:
        model = ImagenHematologia
        fields = ['imagen']


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

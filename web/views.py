from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.urls import reverse
from django.contrib import messages

from api.models import Cassette, Muestra, Imagen
from .forms import CassetteForm, MuestraForm, InformeForm, ImagenForm


# ── Auth ─────────────────────────────────────────────────────────────────────

def login_view(request):
    if request.user.is_authenticated:
        return redirect('cassettes')
    error = None
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '')
        user = authenticate(request, username=email, password=password)
        if user:
            login(request, user)
            return redirect(request.GET.get('next', 'cassettes'))
        error = 'Email o contraseña incorrectos.'
    return render(request, 'web/login.html', {'error': error})


@require_POST
def logout_view(request):
    logout(request)
    return redirect('login')


# ── Cassettes (lista + detalle) ───────────────────────────────────────────────

@login_required
def cassette_list(request):
    qs = Cassette.objects.select_related('tecnico').order_by('-fecha')

    organo = request.GET.get('organo', '').strip()
    numero = request.GET.get('numero', '').strip()
    inicio = request.GET.get('inicio', '').strip()
    fin    = request.GET.get('fin', '').strip()
    sel_pk = request.GET.get('cassette', '').strip()

    if organo and organo != '*':
        qs = qs.filter(organo__icontains=organo)
    if numero:
        qs = qs.filter(cassette__icontains=numero)
    if inicio and fin:
        qs = qs.filter(fecha__gte=inicio, fecha__lte=fin)

    if not any([organo, numero, inicio, fin]):
        qs = qs[:10]

    selected = None
    muestras_con_imagenes = []

    if sel_pk:
        try:
            selected = Cassette.objects.select_related('tecnico').get(pk=sel_pk)
            muestras_con_imagenes = [
                {'muestra': m, 'imagenes': Imagen.objects.filter(muestra=m)}
                for m in Muestra.objects.filter(cassette=selected)
            ]
        except Cassette.DoesNotExist:
            pass

    return render(request, 'web/cassettes.html', {
        'cassettes':             qs,
        'selected':              selected,
        'muestras_con_imagenes': muestras_con_imagenes,
        'cassette_form':         CassetteForm(instance=selected) if selected else CassetteForm(),
        'nuevo_cassette_form':   CassetteForm(),
        'muestra_form':          MuestraForm(),
        'informe_form': InformeForm(initial={
            'informe_descripcion':   selected.informe_descripcion   if selected else '',
            'informe_fecha':         selected.informe_fecha          if selected else '',
            'informe_tincion':       selected.informe_tincion        if selected else '',
            'informe_observaciones': selected.informe_observaciones  if selected else '',
        }) if selected else None,
        'filtros': {'organo': organo, 'numero': numero, 'inicio': inicio, 'fin': fin},
    })


# ── Cassette CRUD ─────────────────────────────────────────────────────────────

@login_required
@require_POST
def cassette_create(request):
    form = CassetteForm(request.POST)
    if form.is_valid():
        c = form.save(tecnico=request.user)
        return redirect(reverse('cassettes') + f'?cassette={c.pk}')
    messages.error(request, 'Error al crear el cassette. Revisa los campos.')
    return redirect('cassettes')


@login_required
@require_POST
def cassette_update(request, pk):
    cassette = get_object_or_404(Cassette, pk=pk)
    form = CassetteForm(request.POST, instance=cassette)
    if form.is_valid():
        form.save()
        return redirect(reverse('cassettes') + f'?cassette={pk}')
    messages.error(request, 'Error al modificar el cassette.')
    return redirect(reverse('cassettes') + f'?cassette={pk}')


@login_required
@require_POST
def cassette_delete(request, pk):
    get_object_or_404(Cassette, pk=pk).delete()
    return redirect('cassettes')


@login_required
@require_POST
def cassette_informe(request, pk):
    cassette = get_object_or_404(Cassette, pk=pk)
    form = InformeForm(request.POST, request.FILES)
    if form.is_valid():
        cassette.informe_descripcion   = form.cleaned_data['informe_descripcion']
        cassette.informe_fecha         = form.cleaned_data['informe_fecha']
        cassette.informe_tincion       = form.cleaned_data['informe_tincion']
        cassette.informe_observaciones = form.cleaned_data['informe_observaciones']
        img = form.cleaned_data.get('informe_imagen')
        if img:
            cassette.informe_imagen = img.read()
        cassette.save()
    return redirect(reverse('cassettes') + f'?cassette={pk}')


# ── Muestras ──────────────────────────────────────────────────────────────────

@login_required
@require_POST
def muestra_create(request, cassette_pk):
    cassette = get_object_or_404(Cassette, pk=cassette_pk)
    form = MuestraForm(request.POST)
    if form.is_valid():
        form.save(cassette=cassette)
    return redirect(reverse('cassettes') + f'?cassette={cassette_pk}')


@login_required
@require_POST
def muestra_update(request, pk):
    muestra = get_object_or_404(Muestra, pk=pk)
    form = MuestraForm(request.POST, instance=muestra)
    if form.is_valid():
        form.save()
    return redirect(reverse('cassettes') + f'?cassette={muestra.cassette_id}')


@login_required
@require_POST
def muestra_delete(request, pk):
    muestra = get_object_or_404(Muestra, pk=pk)
    cid = muestra.cassette_id
    muestra.delete()
    return redirect(reverse('cassettes') + f'?cassette={cid}')


# ── Imágenes ──────────────────────────────────────────────────────────────────

@login_required
@require_POST
def imagen_upload(request, muestra_pk):
    muestra = get_object_or_404(Muestra, pk=muestra_pk)
    form = ImagenForm(request.POST, request.FILES)
    if form.is_valid():
        img = form.save(commit=False)
        img.muestra = muestra
        img.save()
    return redirect(reverse('cassettes') + f'?cassette={muestra.cassette_id}')


@login_required
@require_POST
def imagen_delete(request, pk):
    imagen = get_object_or_404(Imagen, pk=pk)
    cid = imagen.muestra.cassette_id
    imagen.imagen.delete(save=False)
    imagen.delete()
    return redirect(reverse('cassettes') + f'?cassette={cid}')

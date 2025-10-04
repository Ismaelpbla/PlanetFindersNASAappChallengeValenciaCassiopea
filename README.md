
# My V0 Project

Este proyecto está desarrollado con **Next.js** y **TypeScript**. A continuación se detallan las instrucciones para instalar Node.js y npm en Ubuntu y ejecutar el proyecto en local.

---

## Requisitos previos

- Ubuntu 20.04 o superior.
- Acceso a la terminal.
- Conexión a internet.

---

## 1. Actualizar el sistema

```bash
sudo apt update
sudo apt upgrade -y
````

---

## 2. Instalar Node.js y npm

Es recomendable instalar Node.js desde el **repositorio oficial de NodeSource** para obtener la versión más reciente.

1. Añadir el repositorio NodeSource (Node.js 20 LTS):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

2. Instalar Node.js (npm se instala automáticamente):

```bash
sudo apt install -y nodejs
```

3. Verificar la instalación:

```bash
node -v
npm -v
```

Deberías ver algo similar a:

```
v20.x.x
9.x.x
```

---

## 3. Instalar dependencias del proyecto

En la carpeta raíz del proyecto:

```bash
npm install
```

> ⚠️ Si aparece un error de dependencias (ERESOLVE), puedes usar:
>
> ```bash
> npm install --legacy-peer-deps
> ```

---

## 4. Ejecutar el proyecto en modo desarrollo

```bash
npm run dev
```

* El proyecto se ejecutará en [http://localhost:3000](http://localhost:3000)
* Hot-reload activado: cada cambio en los archivos se reflejará automáticamente.

---

## 5. Construir para producción (opcional)

```bash
npm run build
npm start
```

* `npm run build`: compila el proyecto optimizado para producción.
* `npm start`: ejecuta el proyecto compilado.


## 6. Créditos

* Proyecto desarrollado por [Tu Nombre] y colaboradores.
* Basado en Next.js, TypeScript y TailwindCSS.

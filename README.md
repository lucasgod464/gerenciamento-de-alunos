# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e97e1de7-c1d2-40fe-a7ea-f7805944041e

## Como instalar em uma VPS

### Pré-requisitos
1. Uma VPS com Ubuntu/Debian
2. Node.js 18+ instalado
3. Git instalado
4. NPM instalado

### Passo a passo para instalação

```bash
# 1. Atualize os pacotes do sistema
sudo apt update
sudo apt upgrade

# 2. Instale o Node.js e npm (se ainda não estiver instalado)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Instale o Git (se ainda não estiver instalado)
sudo apt install git

# 4. Clone o repositório
git clone <YOUR_GIT_URL>

# 5. Entre na pasta do projeto
cd <YOUR_PROJECT_NAME>

# 6. Instale as dependências
npm install

# 7. Crie o build de produção
npm run build

# 8. Para rodar em produção, você pode usar o PM2
npm install -g pm2
pm2 start npm --name "seu-app" -- start

# 9. Configure o PM2 para iniciar com o sistema
pm2 startup
pm2 save
```

### Configurando Nginx (opcional, mas recomendado)

```bash
# 1. Instale o Nginx
sudo apt install nginx

# 2. Crie um arquivo de configuração para seu site
sudo nano /etc/nginx/sites-available/seu-app

# 3. Adicione a configuração básica
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 4. Crie um link simbólico
sudo ln -s /etc/nginx/sites-available/seu-app /etc/nginx/sites-enabled/

# 5. Teste a configuração do Nginx
sudo nginx -t

# 6. Reinicie o Nginx
sudo systemctl restart nginx
```

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e97e1de7-c1d2-40fe-a7ea-f7805944041e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e97e1de7-c1d2-40fe-a7ea-f7805944041e) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

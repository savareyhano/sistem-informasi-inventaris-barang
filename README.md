# Sistem Informasi Inventaris Barang

An inventory management application. This is my final project for WGS Bootcamp Batch 4.

## Table of Contents

- [First Time Setup](#first-time-setup)
  - [Prerequisite](#prerequisite)
  - [Installation](#installation)
- [Running Locally](#running-locally)
- [Main Features](#main-features)
- [Screenshots](#screenshots)
  - [Dashboard](#dashboard)
  - [Table](#table)
  - [Print QR Code](#print-qr-code)
  - [Scan QR Code](#scan-qr-code)
  - [Dark Mode](#dark-mode)
- [License](#license)

## First Time Setup

### Prerequisite

- [Git](https://git-scm.com/downloads)
- [Node](https://nodejs.org/en/download/current)
- [PostgreSQL](https://www.postgresql.org/download/)

Make sure your system PATH includes Postgres tools. For Windows, [see instructions here](https://www.commandprompt.com/education/how-to-set-windows-path-for-postgres-tools/).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/savareyhano/Sistem-Informasi-Inventaris-Barang.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Sistem-Informasi-Inventaris-Barang
   ```

3. Create a `.env` file (further configuration needed to match your Postgres database settings):

   ```bash
   cp .env.example .env
   ```

4. Install the dependencies:

   ```bash
   npm install
   ```

5. Create the database:

   ```bash
   npm run setup-db
   ```

## Running Locally

1. Start the project:

   ```bash
   npm start
   ```

2. Visit [http://localhost:3000](http://localhost:3000) (this may vary depending on the `HOSTNAME` and `PORT` values you set in the `.env` file).

3. Login with the following credentials:

  | email | password | role |
  |---|---|---|
  | superadmin@email.com | superadmin123 | superadmin |
  | admin@email.com | admin123 | superadmin |
  | user@email.com | password | user |
  | usr@email.com | password | user |

## Main Features

- **Integrated Bulk QR Code Generator**: Enables the creation of QR codes in bulk for selected items, complete with customization options for resizing and printing.
- **Versatile QR Code Scanner**: Offers the ability to scan QR codes using webcam devices or by uploading images.

## Screenshots

### Dashboard

![Dashboard](https://user-images.githubusercontent.com/32730327/273454645-93f713e4-ae39-46f9-8557-5403794b8104.png)

### Table

![Table](https://user-images.githubusercontent.com/32730327/273454711-420e7794-6de7-4a96-bd93-51c745c4e983.png)

### Print QR Code

![Print QR](https://user-images.githubusercontent.com/32730327/279402658-b86975e8-857c-46ee-9fa6-0501d59afde6.png)

### Scan QR Code

![Scan QR1](https://user-images.githubusercontent.com/32730327/273454801-d9c2f9e0-5ee1-4708-8283-656e787ce9f2.png)
![Scan QR2](https://user-images.githubusercontent.com/32730327/273454805-ca0edc90-de09-4def-a2fa-9fa7cfe7dfb0.png)

### Dark Mode

![Dark Mode](https://user-images.githubusercontent.com/32730327/273454814-4f1d843c-59bf-4469-bb28-92ebf73f9caa.png)

## License

This project is licensed under the [GNU General Public License v3.0](https://github.com/savareyhano/Sistem-Informasi-Inventaris-Barang/blob/main/LICENSE).

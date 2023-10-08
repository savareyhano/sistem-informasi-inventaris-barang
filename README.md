## Sistem Informasi Inventaris Barang

An inventory management application. This is my Final Project for WGS Bootcamp Batch 4.

**Main features**:

- Built-in Bulk QR Code Generator. Can make (technically) infinite amount of QR codes of selected items and print it.
- QR Code Scanner. Scan QR using webcam device or from image via upload.

### TODO

- [x] ~~Fix the authentication (add cookie to store the session).~~
- [x] ~~Refactor the codes.~~

## Project Screenshots

**Dashboard**<br>
![Dashboard](https://user-images.githubusercontent.com/32730327/273454645-93f713e4-ae39-46f9-8557-5403794b8104.png)

**Table**<br>
![Table](https://user-images.githubusercontent.com/32730327/273454711-420e7794-6de7-4a96-bd93-51c745c4e983.png)

**Print QR Code**<br>
![Print QR](https://user-images.githubusercontent.com/32730327/273454740-4a5de934-0a78-47ca-b92d-11419febe76f.png)

**Scan QR Code**<br>
![Scan QR1](https://user-images.githubusercontent.com/32730327/273454801-d9c2f9e0-5ee1-4708-8283-656e787ce9f2.png)
![Scan QR2](https://user-images.githubusercontent.com/32730327/273454805-ca0edc90-de09-4def-a2fa-9fa7cfe7dfb0.png)

**Dark Mode**<br>
![Dark Mode](https://user-images.githubusercontent.com/32730327/273454814-4f1d843c-59bf-4469-bb28-92ebf73f9caa.png)

## Installation and Setup Instructions

**Prerequisite**:

- [Node](https://nodejs.org/en/download/current)
- [PostgreSQL](https://www.postgresql.org/download/)

Make sure the Path for Postgres tools is already set on your system. For Windows, [read here](https://www.commandprompt.com/education/how-to-set-windows-path-for-postgres-tools/) to know how.

**Steps**:

1. Create the `.env` file and configure it to match your Postgres database settings. You can refer to the `.env-example` file for guidance.
2. Open your terminal and run `npm install` to install the required node packages. If any problems occur, try running `npm update`.
3. Run `npm run setup-db` to create the database. The database name will be the same as the value specified for `PGDATABASE` in the `.env` file. This command will also restore the SQL file (db.sql) into the created database.
4. Finally, run `npm start` to start the project.

When prompted to log in, use the following credentials:

**Email**: superadmin@email.com<br>
**Password**: superadmin123

## License

Sistem Informasi Inventaris Barang is released under the GNU General Public License v3.0. [See LICENSE](https://github.com/savareyhano/Sistem-Informasi-Inventaris-Barang/blob/main/LICENSE) for details.

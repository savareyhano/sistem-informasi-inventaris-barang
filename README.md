## Sistem Informasi Inventaris Barang

An inventory management application. This is my Final Project for WGS Bootcamp Batch 4.

**Main features**:

- Built-in Bulk QR Code Generator. Can make (technically) infinite amount of QR codes of selected items and print it.
- QR Code Scanner. Scan QR using webcam device or from image via upload.

### TODO

- [x] ~~Fix the authentication (add cookie to store the session).~~
- [x] ~~Refactor the codes.~~

## Project Screenshots

**Note**: If the image doesn't load, refresh the page.

**Dashboard**<br>
![Dashboard](https://drive.google.com/uc?id=1yuC7Kiy_AFIaoQAMqnk9y1FYAPszi7DR)

**Table**<br>
![Table](https://drive.google.com/uc?id=18YWFAbevDwTxNy7UhvFXjiv1E0rsy7pR)

**Print QR Code**<br>
![Print QR](https://drive.google.com/uc?id=1I0q6t7GiUn5h0dgjI-2a0MkE_uCmk0GL)

**Scan QR Code**<br>
![Scan QR1](https://drive.google.com/uc?id=11UdorMEwZNs_lH8V_RS0gWUMO4wI7ND_)
![Scan QR2](https://drive.google.com/uc?id=1l_3E9EsYOuefDA6q-orAP_Bd_k8keb_9)

**Dark Mode**<br>
![Dark Mode](https://drive.google.com/uc?id=1ZNM_EChIzNhLK7KBfq3L3mvz7qRfYeW4)

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

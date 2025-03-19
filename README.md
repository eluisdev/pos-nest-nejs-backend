# 🚀 POS-NEXT-NEST Project (BackEnd)

## 🛠 Technologies Used

This project is the **backend** of a **Point of Sale (POS)** system built using **NestJS**. The backend is developed with **NestJS**, leveraging modern tools and libraries for efficient development, database management, and API creation.

---

## 🖥 Backend - NestJS

This project is the **backend** of a **Point of Sale (POS)** system built using **NestJS**. The backend is developed with **NestJS**, leveraging modern tools and libraries for efficient development, database management, and API creation.

### 📦 Main Dependencies
```json
{
 "@nestjs/common": "^10.0.0",
  "@nestjs/config": "^3.3.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/jwt": "^10.2.0",
  "@nestjs/mapped-types": "*",
  "@nestjs/platform-express": "^10.0.0",
  "@nestjs/typeorm": "^10.0.2",
  "bcryptjs": "^2.4.3",
  "class-transformer": "^0.5.1",
  "class-validator": "^0.14.1",
  "cloudinary": "^2.5.1",
  "date-fns": "^4.1.0",
  "pg": "^8.13.1",
  "reflect-metadata": "^0.2.0",
  "rxjs": "^7.8.1",
  "streamifier": "^0.1.1",
  "typeorm": "^0.3.20"
}
```

### 📦 Develop Dependencies
```json
{
 "@nestjs/cli": "^10.0.0",
  "@nestjs/schematics": "^10.0.0",
  "@nestjs/testing": "^10.0.0",
  "@types/express": "^5.0.0",
  "@types/jest": "^29.5.2",
  "@types/multer": "^1.4.12",
  "@types/node": "^20.3.1",
  "@types/streamifier": "^0.1.2",
  "@types/supertest": "^6.0.0",
  "@typescript-eslint/eslint-plugin": "^8.0.0",
  "@typescript-eslint/parser": "^8.0.0",
  "eslint": "^8.0.0",
  "eslint-config-prettier": "^9.0.0",
  "eslint-plugin-prettier": "^5.0.0",
  "jest": "^29.5.0",
  "prettier": "^3.0.0",
  "source-map-support": "^0.5.21",
  "supertest": "^7.0.0",
  "ts-jest": "^29.1.0",
  "ts-loader": "^9.4.3",
  "ts-node": "^10.9.1",
  "tsconfig-paths": "^4.2.0",
  "typescript": "^5.1.3"
}
```

---

## ✅ Key Features

- **Authentication:** Implements **JWT-based authentication** using **@nestjs/jwt** and **bcryptjs** for secure password hashing.
- **Database Management:** Uses **TypeORM** with **PostgreSQL** for efficient database interactions.
- **File Uploads:** Integrates **Cloudinary** and **Multer** for handling file uploads.
- **Validation:** Utilizes **class-validator** and **class-transformer** for robust request validation.
- **Configuration Management:** Leverages **@nestjs/config** for environment variable management.
- **Testing:** Includes **Jest** and **Supertest** for unit and end-to-end testing.

---

## 📌 Installation & Setup

# Install dependencies
```
npm install
```

# Run project in development environment
```
npm run start:dev
```

# Build the Project
```
npm run build
```

# Start the production server
```
npm run start:prod
```
---

## 📜 License
This project is licensed under the **MIT** license.

---

✨ _Developed with passion by eluisdev_

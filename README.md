
# **TheRoot O1**

**TheRoot O1** is a full-stack project management application designed to simplify the management of personnel, projects, clients, and resources. The application includes a robust backend built with Node.js and Express.js, along with a modern, responsive frontend powered by React and TypeScript.

---

## **Features**

### Backend
- RESTful API for seamless integration.
- Secure JWT-based authentication.
- Modular and scalable architecture.
- Database integration with a focus on efficiency and reliability.

### Frontend
- Built with React and TypeScript for maintainability.
- Responsive design powered by TailwindCSS.
- Interactive features, including timelines and real-time updates.

---

## **Project Structure**

### Backend
```
backend/
├── app.js                # Main application file
├── config/               # Configuration files
├── models/               # Database models
├── routes/               # API routes
├── .env                  # Environment variables
└── package.json          # Dependencies
```

### Frontend
```
frontend/
├── src/
│   ├── components/       # UI components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Application pages
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── types/            # TypeScript type definitions
├── index.html            # Main HTML file
├── tailwind.config.js    # TailwindCSS configuration
└── package.json          # Dependencies
```

---

## **Setup**

### Prerequisites
- **Node.js** (v16.x or higher)
- **npm** or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/metinxsezdin/theroot_o1.git
   cd theroot_o1
   ```

2. Backend setup:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure environment variables in .env file
   npm start
   ```

3. Frontend setup:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Configure environment variables in .env file
   npm run dev
   ```

---

## **Backend API Endpoints**

### **Activities**
- **GET /activities**: Fetch all activities.
- **POST /activities**: Create a new activity.
  - **Body Parameters**:
    ```json
    {
      "name": "Activity Name",
      "description": "Activity Description"
    }
    ```

### **Authentication**
- **POST /auth/register**: Register a new user.
  - **Body Parameters**:
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "password": "securepassword"
    }
    ```
- **POST /auth/login**: Login and receive a JWT token.
  - **Body Parameters**:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword"
    }
    ```

### **Bookings**
- **GET /bookings**: Fetch all bookings.
- **POST /bookings**: Create a new booking.
  - **Body Parameters**:
    ```json
    {
      "clientId": 123,
      "projectId": 456,
      "startTime": "2024-12-07T09:00:00Z",
      "endTime": "2024-12-07T17:00:00Z"
    }
    ```

### **Client Employees**
- **GET /ClientEmployees**: Fetch all client employees.
- **GET /ClientEmployees/:id**: Fetch a specific client employee by ID.
- **POST /ClientEmployees**: Add a new client employee.
  - **Body Parameters**:
    ```json
    {
      "clientId": 123,
      "name": "Employee Name",
      "position": "Position Title"
    }
    ```

### **Clients**
- **GET /clients**: Fetch all clients.
- **GET /clients/:id**: Fetch a specific client by ID.
- **POST /clients**: Add a new client.
  - **Body Parameters**:
    ```json
    {
      "name": "Client Name",
      "email": "client@example.com",
      "phone": "123-456-7890"
    }
    ```
- **PUT /clients/:id**: Update client information.
  - **Body Parameters**:
    ```json
    {
      "name": "Updated Client Name",
      "email": "updated_email@example.com",
      "phone": "987-654-3210"
    }
    ```
- **DELETE /clients/:id**: Delete a client by ID.

### **Departments**
- **GET /departments**: Fetch all departments.
- **POST /departments**: Create a new department.
  - **Body Parameters**:
    ```json
    {
      "name": "Department Name",
      "head": "Head of Department"
    }
    ```

### **Personnel**
- **GET /personnel**: Fetch all personnel.
- **GET /personnel/:id**: Fetch a specific personnel by ID.
- **POST /personnel**: Add a new personnel member.
  - **Body Parameters**:
    ```json
    {
      "name": "Personnel Name",
      "role": "Role Title",
      "email": "personnel@example.com",
      "availability": true
    }
    ```
- **PUT /personnel/:id**: Update personnel information.
- **DELETE /personnel/:id**: Delete personnel by ID.

### **Projects**
- **GET /projects**: Fetch all projects.
- **GET /projects/:id**: Fetch details of a specific project by ID.
- **POST /projects**: Create a new project.
  - **Body Parameters**:
    ```json
    {
      "name": "Project Name",
      "description": "Project Description",
      "startDate": "2024-12-01",
      "endDate": "2024-12-31"
    }
    ```
- **PUT /projects/:id**: Update project details.
- **DELETE /projects/:id**: Delete a project by ID.

---

## **Usage**

### Start Backend
```bash
cd backend
npm start
```

### Start Frontend
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:5173`.

---

## **Contributing**

1. Fork the repository.
2. Create a new branch for your feature.
3. Commit your changes.
4. Open a pull request.

---

## **License**

This project is licensed under the [MIT License](LICENSE).

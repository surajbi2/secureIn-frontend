Great! Since you're using **draw\.io**, here’s a clear outline of what to include for each UML diagram — so you can easily build them using the appropriate shapes and layout.

---

## ✅ USE CASE DIAGRAM (1 per system)

### 🔹 SecureIn – Use Case Diagram

**Actors:**

* Admin
* Security Personnel
* Department Head
* Visitor

**Use Cases (ellipses):**

* Login
* Generate Entry Pass
* Create Event
* Approve Passes
* Scan QR Code
* View Visitor Logs

**Example layout:**

* Place actors on the left and right
* Group related use cases in the center
* Connect each actor to their relevant use cases using solid lines

---
The SecureIn system supports four main actors: Admin, Security Personnel, Department Head, and Visitor. The Admin can log in, create events, and approve passes. Security personnel are responsible for generating entry passes and scanning QR codes for visitor verification. Department Heads may also assist in creating events. Visitors are indirectly involved through the issuance and validation of passes. Core use cases like login, pass generation, QR scanning, and log viewing are grouped centrally and connected to their respective actors, representing a secure, role-based campus entry system.
---

### 🔹 IQAC System – Use Case Diagram

**Actors:**

* Admin
* Committee Member
* User

**Use Cases:**

* Login
* Upload Minutes of Meeting (Admin)
* Approve Notices (Admin)
* View Reports (User, Member)
* Manage Committee Members (Admin)

---
The IQAC Management System includes three primary actors: Admin, Committee Member, and User. The Admin handles system management tasks such as logging in, uploading Minutes of Meeting (MoM), approving user-submitted notices, and managing committee members. Committee Members and Users can log in and view reports. The use cases are centered around document workflow and oversight, ensuring proper access control and accountability in academic committee operations.
---

## ✅ CLASS DIAGRAM (1 per system)

Use **rectangles** with three compartments (name, attributes, methods). Use arrows to show relationships.

### 🔹 SecureIn – Class Diagram

**Classes:**

* `User`: id, name, email, role
* `Event`: id, name, date, venue
* `EntryPass`: id, pass\_id, event\_id, visitor\_name, status
* `VisitorLog`: id, pass\_id, timestamp, action

**Relationships:**

* User (1) → (many) EntryPass
* Event (1) → (many) EntryPass
* EntryPass (1) → (many) VisitorLog

Use:

* Solid lines with diamonds for composition (e.g., Event "has" EntryPass)
* Arrows with labels for inheritance if applicable

---
The UML Class Diagram represents the SecureIn Visitor Management System for CUK, featuring a role-based access control model.

The base User class is extended by Admin, SecurityGuard, and Head, each with specific responsibilities:

Admin manages users, events, entry passes, and reports.

SecurityGuard verifies QR-based passes and tracks visitor entry/exit.

Head oversees department events and views reports.

EntryPass handles visitor access with details like QR codes, validity, and purpose. Event represents university events linked to multiple entry passes. Report provides analytics for both Admins and Heads.

This structure ensures secure, efficient, and accountable visitor and event management within the university.
---

### 🔹 IQAC – Class Diagram

**Classes:**

* `User`: id, name, role
* `CommitteeMember`: id, name, designation
* `MomReport`: id, title, file, status
* `Notice`: id, title, description, status

**Relationships:**

* User (Admin) manages MomReports and Notices
* CommitteeMember is managed by Admin

---

The UML Class Diagram depicts a web-based notice and MoM management system with role-based access. The User class holds common attributes like userId, name, email, password, and role ('user' or 'admin'), enabling login, notice upload, and file download. The Admin class inherits from User and has extra privileges such as creating users, approving/rejecting notices, and uploading MoM reports. The Notice class stores user-uploaded documents with details and status, linked to users in a one-to-many relationship. The MoM class represents admin-uploaded meeting minutes, associated similarly with Admins. This design ensures clear roles, accountability, and structured content approval within the system.
---

## ✅ SEQUENCE DIAGRAM (1 per system)

Use **vertical lifelines** and horizontal arrows to show time-based interaction.

### 🔹 SecureIn – Sequence Diagram (QR Scan)

**Participants (top to bottom):**

* Security Staff
* Web App (Frontend)
* Backend API
* Database

**Steps:**

1. Scan QR code
2. Send request to API
3. Validate pass
4. Update pass status
5. Return result (valid/invalid)

---
This sequence diagram outlines the SecureIn Visitor Entry Management System. The Admin creates an event via the React frontend, which is saved in the MySQL database through the Node.js backend. The Security Staff generates an entry pass by selecting an event and entering visitor details. The backend assigns a unique UUID, stores the pass, and returns a QR code for display or download.

At the entry point, the QR code is scanned. The UUID is sent to the backend for validation. If the pass is valid and unused, the backend marks it as 'used' and returns a validation result. The frontend then notifies the staff with a "Valid" or "Invalid" message.

This flow ensures secure, QR-based visitor verification linked to specific events.
---

### 🔹 IQAC – Sequence Diagram (Upload and Approval)

**Participants:**

* Admin
* Web App
* API Server
* Database

**Steps:**

1. Admin uploads file
2. Frontend sends request
3. Backend stores file and metadata
4. Admin approves
5. File becomes available to others

---

If you need **icons** or **stencils** in draw\.io:

* Use **UML** shape library (enable from left panel → “More Shapes” → UML)
* Drag actors, classes, lifelines, and arrows easily from that set

---
The sequence diagram for the IQAC Notice and MoM Management System outlines a clear, role-based workflow. A user logs in and uploads a notice, which is stored in the database as 'pending'. The admin logs in, views pending notices, and approves or rejects them. The admin can also upload Minutes of Meeting (MoM) files. Once approved, users can view and download notices and MoMs. This ensures secure content flow, admin moderation, and proper access control for institutional document management.
---

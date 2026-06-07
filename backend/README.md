## Backend Database

This backend uses MongoDB with Mongoose.

### Collections used by the current UI and API

- `users`: auth, roles, enrolled courses, profile links
- `profiles`: gender, DOB, contact number, bio
- `categories`: catalog and add-course category dropdown
- `courses`: instructor-created courses, price, thumbnail, status, sold count
- `sections`: course chapters
- `subsections`: lecture records and video URLs
- `courseprogresses`: completed lecture tracking
- `ratingandreviews`: student reviews
- `otps`: email verification codes
- `payments`: Razorpay order/payment audit trail
- `contactmessages`: contact form submissions

### Seed initial categories

Run this from the `backend` folder after setting `DB_URL` in `.env`:

```bash
npm run seed
```

That will create the starter categories used by the course creation UI:

- Web Development
- Programming Fundamentals
- Data Science
- DevOps & Cloud
- Mobile Development
- AI & Machine Learning

It also creates sample published courses for the catalog plus demo login accounts:

- Instructor: `instructor@example.com` / `Instructor123`
- Student: `student@example.com` / `Student123`

### Gmail OTP setup

To send OTP emails with Gmail, update `backend/.env` with:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_SECURE=true
MAIL_FROM_NAME=LEARN & IMPROVE
MAIL_USER=your-gmail@gmail.com
MAIL_PASS=your-16-char-gmail-app-password
```

Use a Gmail App Password, not your normal Gmail password.
# LEARN & IMPROVE

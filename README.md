# Be There
Be There is an volunteer scheduling app focused on minimizing food waste on university campuses across the country. Each week, you can sign up for volunteer roles to transport excess food from campus dining halls to nearby food insecurity organizations. By providing a flexible sign up system that allows for the ever-changing availability of university studens, we ensure that there will alwyas be people to Be There for the job!

## Inspiration
MealCare is an incredible organization that has donated over 155,220 meals across Canada by rescuing surplus food and distributing it to those in need. I’ve had the privilege of volunteering with the UBC chapter since it first launched, and it’s been inspiring to see it grow.
However, as a newly established chapter, the executive team has had to juggle a lot - securing funding, recruiting volunteers, and coordinating logistics - all while relying entirely on a single iMessage group chat for communication.
This informal system, while quick and accessible, has revealed a number of challenges over the past year:
Volunteers sign up for shifts by liking and unliking messages, which is hard to track and easy to miss.
Shifts are often dropped last minute, as students juggle busy and unpredictable schedules.
Volunteers genuinely want to help, but without structure, participation becomes inconsistent.
Execs are left unsure whether key tasks and food pickups will actually be covered each day.
The result is a system that feels disorganized and fragile, despite everyone’s best intentions. We built our project to bring order, flexibility, and reliability to grassroots volunteer efforts like MealCare UBC.

## What it does
Be There is a lightweight volunteer scheduling platform built to streamline coordination for student-run organizations like MealCare. Volunteers can sign up for weekly shifts through an easy-to-use interface that reflects the club’s actual operational structure.

Each day includes six defined roles:
1 Driver
3 Volunteers
Backup Drivers
Backup Volunteers

Volunteers simply log in with a username, view available roles, and claim a slot. The app ensures:
No double-booking for the same day
Backup roles only open once primary roles are filled
Automatic registration from backup queue upon cancellation from a primary role user
Users can queue as a backup for both primary roles in one day, but will only be assigned to one of them if needed


This setup creates clarity and flexibility, so volunteers can contribute without overcommitting, and organizers know exactly who to expect each day.


## How we built it

We built Be There as a responsive web app tailored to the scheduling needs of student-run volunteer organizations like MealCare. Using CSS and JavaScript for the front end with React.js framework, we created an intuitive interface that allows users to sign up for volunteer roles quickly and reliably. For the back end, we used Node.js with Express to manage user sessions, sign-ups, and queue logic. We focused on user-centric features like live shift availability, backup role logic, and restrictions that prevent duplicate or conflicting signups.


## Challenges we ran into

One of our biggest challenges was testing edge cases, especially around volunteer shift management logic. We had to carefully design the system so that:
Users couldn’t double-book themselves on the same day
Backup volunteers only signed up when primary roles were full
The queue logic didn’t auto-assign people to multiple roles if a shift was dropped
Ensuring clean UX while managing backend complexity was tough, especially within the limited time of a hackathon where we had to both learn and implement all together.


## Accomplishments that we're proud of

We implemented a working login system that distinguishes between display names and usernames, allowing duplicate names but preventing duplicate accounts.


Our role registration system includes built-in safeguards: users can’t sign up for the same day twice, and backup roles activate only when necessary.


The app handles two queues per day and ensures volunteers are assigned a single appropriate role if someone drops out.


It’s already designed to reflect MealCare’s unique six-role structure—making it practical and immediately useful.


## What we learned

We learned how to build a smarter scheduling system by combining structure with empathy for how students plan their time. Our shift system had to be simple, reliable, and respectful of busy student schedules. This project reminded us that volunteer coordination isn’t just a technical challenge, it’s a human one shaped by unpredictable schedules, changing priorities, and the desire to help without being overwhelmed. Designing a solution meant thinking beyond just features; we had to deeply consider how people behave, communicate, and adapt.

On the technical side, almost everything we used in the project was new to us, making the experience not only accomplishment focused, but also learning forward. We picked up JavaScript/CSS, web app development and frameworks, and team-based Git workflows, all for the first time. We also strengthened our knowledge of user authentication, queue management, and UI/UX design for practical, real-world applications.

We also learned the value of real user feedback. Talking to actual volunteers and organizers of MealCare helped us shape the design and functionality of the app. Their input directly influenced how we handled backups, interface clarity, and shift restrictions. Our UI improved dramatically after these conversations, and it reinforced how important it is to involve users early and often when building a tool like this.



## What's next for Be There

Be There was built with MealCare UBC in mind as a direct, practical solution that’s built to scale. The chapter president was excited about implementing the platform, especially because the backup system directly addresses one of their biggest pain points.

Looking ahead, we want to make Be There flexible enough for other volunteer organizations, including FoodStash, to use as well. Our next steps include:
Allowing organizations to customize the number and type of roles based on their own needs (e.g. delivery drivers, food sorters, event volunteers, etc.)
Building out an organization onboarding system so new groups can set up their own instance of the app easily
Continuing to refine the platform with input from users to make it as intuitive and helpful as possible—for both volunteers and coordinators
Ultimately, we want Be There to become a tool that brings structure and peace of mind to grassroots volunteer efforts everywhere.
Other improvements we would love to implement include:
Professional login: Transitioning to an email-based authentication system will improve security and enable more reliable communication.
Notifications: We'll integrate email reminders and instant alerts using a notification API for important events (e.g. shift drops, backup promotion, weekly reset).

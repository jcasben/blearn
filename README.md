# BLearn

An educative platform that uses [Blockly](https://developers.google.com/blockly) 
aiming to teach students the fundamentals of coding. It has 2 modes: one is for
the teachers to create and configure activities for their students; and the other
one is for the students to import the activities created by the teachers and
solve them.

Built for Creation of Educational software, at Comenius University of Bratislava.

## ⁉️ Why?

The motivation of this project was creating a piece of software that could be
used to teach students the basics of computer science.

## 📦 Technologies

For this project, I only used the following technologies:

- Angular 19
- Blockly
- TailwindCSS

I decided to go for Angular because I am currently learning it. In addition, the
project had a very clear specification that we had to follow, making it a great
choice by its robustness and strong structuring.

## ⚙️ Implementation

This project only has a screen for displaying the main menu of the app and other
screen to show the detail and workspace of an activity in particular. Each one
of this screens can be in one of these modes: student or teacher.

Depending on the current mode, the user can perform certain actions.

Teacher mode is the most important one of the application. It has the ability of
creating activities from scratch, configure them, add or remove coding blocks, add 
objects to the scene...
Then, once finished, the teacher can download a file with `.blearn` extension,
which allows students and teachers to import this activity.

In student mode, all features are a bit more limited. A student can only import
activities and play with the given objects and blocks given by the teacher.
This is important so the teacher has control over the way that the student solves
the task.

All the work from students and teachers is saved in the local storage of the browser
that they are using. So if you want to work on an activity that you were already
working on other computer, you will have to download it and import it in the
new computer.

This was made for simplicity and ease of development. However, in the future
I am planning in converting it into a full platform, with classrooms and online
assignments.

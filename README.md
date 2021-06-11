# Cannabis Product Diary

## About
Cannabis Product Diary is a web app designed to help consumers of cannabis products
keep track of their experiences and share them with others.

## Bugs
None at this time.

## Future Development
* Add more filters, including a generic search.
* Add more fields to CRUD functionality.
* Improve styling.
* Add liked system.
* More error handling.
* Backgrounds and more themes.

## Wireframe
![Wireframe](assets/wireframe.png)

## User Stories
I will login to gain access to the web app.

As a user, I want to keep track of the cannabis products I consume.
* I can create a new entry by selecting the floating (+) button.
* I may browse my previous entries by filtering and possibly scrolling.
* I can view and edit an entry by selecting it.

As a user, I want to see what other people think about cannabis products they've consumed.
* I may browse public entries by filtering and possibly scrolling.
* I can view an entry by selecting it.
* I can mark entries as helpful or unhelpful.

## ERD
Users
* dateCreated: String Required Default(now)
* email: String Required
* password: String Required
* name: String
* bio: String
* dateOfBirth: String
* location: String

Entries
* author: User id Required
* dateCreated: String Required
* isDraft: Boolean Required
* isPublic: Boolean Required Default(false)
* product: String Required
* content: String
* rating: Number (1-5)
* color: String
* title: String
* dateOfExperience: String
* timeOfDay: Enum ("morning", "noon", "evening", "night")
* productType: Enum ("flower", "concentrate", "joint", "blunt", "accessory", "other")
* duration: Number (in hours)
* quantity: Number
* quantityType: Enum ("hits", "mg", "portions", "items", etc)
* portionSize: Number
* portionSizeType: Enum ("hits", "mg", "portions", "items", etc)
* price: Number
* company: String
* store: String
* city: String
* state: String
* country: String
* strainType: Enum ("indica", "indica dominant", "hybrid", "sativa dominant", "sativa")
* strains: [String]
* thc: Number
* thca: Number
* d8thc: Number
* d9thc: Number
* cbd: Number
* cbg: Number
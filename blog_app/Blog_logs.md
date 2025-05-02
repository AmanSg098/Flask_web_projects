# [01-05-2025]
1. Worked on Database Schema creation using SQL_Alchemy
- User
- Post
- Tags
- Comment
- Bookmark
- Like

# Note:- 

# While using Monolithic structure we need to define the relationship in database schema using foriegn keys between tables but using Microservice architecture, the application must be self-sufficient thus no relations between table and attributes of that table must contain all the associate information.

2. Added config.py, __init__.py, run.py and file for Logs.


# [02-05-2025]
1. Did database migration. Commands are as follows:
- flask db init (only for first time)
- flask db migrate -m "Initial migration"
- flask db upgrade

# Note:-
# Migration helps updating database with any changes made to it without having to lose the data. Thus, no need to recreate tables of write complex update queries.

2. Tested authentication routes.


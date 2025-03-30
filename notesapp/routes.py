from flask import redirect, render_template, url_for, request, flash, abort
from notesapp import app, bcrypt, db
from notesapp.forms import NoteForm, LoginForm, RegisterForm
from notesapp.models import User, Note
from flask_login import login_user, logout_user, login_required, current_user

notes = []

@app.route('/', methods=['GET'])
@app.route('/home', methods=['GET'])
def home():
    form = NoteForm()
    if current_user.is_authenticated:
        notes = Note.query.filter_by(author=current_user).all()
        return render_template('addnote.html', notes=notes, form=form, title='Add Note')
    return render_template('addnote.html', form=form)


@app.route('/add', methods=['POST'])
@login_required
def add_note():
    form = NoteForm()
    if form.validate_on_submit():
        note = Note(title=form.title.data, content=form.content.data, author=current_user)
        db.session.add(note)
        db.session.commit()
        flash('Note Added!','success')
        return redirect(url_for('home'))
    

@app.route('/delete/note/<int:note_id>', methods=['POST'])
@login_required
def delete_note(note_id):
    note = Note.query.get_or_404(note_id)
    if note.author != current_user:
        abort(403)
    db.session.delete(note)
    db.session.commit()
    flash('Note deleted!','info')
    return redirect(url_for('home'))


@app.route('/edit/note/<int:note_id>', methods=['GET','POST'])
def edit_note(note_id):
    note = Note.query.get_or_404(note_id)
    if note.author != current_user:
        abort(403)
    form = NoteForm()
    if form.validate_on_submit():
        note.title = form.title.data
        note.content = form.content.data
        db.session.commit()
        flash("Note Updated!!","success")
        return redirect(url_for('home'))
    
    # pre-fill form fields only for GET requests
    form.title.data = note.title
    form.content.data = note.content
    return render_template('editnote.html', title='Edit Note', note=note, note_id=note.id, form=form)


@app.route('/register', methods=['GET','POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("home"))
    
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_pass = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_pass)
        db.session.add(user)
        db.session.commit()
        flash(f'{form.username.data}, your registration was successful!','success')
        return redirect(url_for('home'))
    return render_template('register.html', form=form, title='Register')


@app.route('/login', methods=['GET','POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user,remember=False  )
            flash(f'{user.username}, you logged in successfully!','success')
            return redirect(url_for('home'))
        else:
            flash('Login Unsuccessful!. Please check email and password', 'danger')
    return render_template('login.html', form=form, title='Login')


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))
# AlgebraSite
A website to solve equations, crack quizes.

## Pre-requisites
The following packages are required:<br />
	1. Python3 <br />
	2. Flask <br />
	4. Gensim <br />
	5. Mongodb <br />


## Note 
The website provides a platform to solve equations by image upload, plot graphs. <br/>
It also has a memo feature where a user can type a note and this demonstrates submission throttling( AJAX Pattern). <br />
The website also provides a quiz. Based on the users performance practice questions can be recommended to him. This is done by building a doc2vec model. The dataset used for the quiz is "Aqua" by DeepMind <br />
User profile page in the website shows the user's top 3 scores and also his performance trend over time. The user can also save his bio data in the same page.<br/>


## Usage

```bash
python3 main.py
```
Then open your browser and enter 127.0.0.1:5000/


## Acknowledgement
This project was done as a part of Web Technologies-2 course at PES University.

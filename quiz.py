# -*- coding: utf-8 -*-
"""
Created on Thu Nov  8 18:03:05 2018

@author: Aishwarya
"""
import numpy as np
import json

no_questions = 5
data = []
with open("data.json") as f:
    for line in f:
        j_content = json.loads(line)
        data.append(j_content)
        
def select_questions():
    problems = np.random.choice(data, no_questions , replace=False)
    prob_dict = {}
    for i in range(0,no_questions):
        prob_dict[str(i)] = problems[i]
    return prob_dict


def sample_questions():
    problems = np.random.choice(data, no_questions , replace=False)
    prob_dict = []
    for i in range(0,no_questions):
        prob_dict.append(problems[i])
    return prob_dict
#select_questions()

from tkinter import *
import re

with open('fiveletterwords.txt', 'r') as f:
    temp_words = f.read().splitlines()
print(temp_words.__len__())

# for word in temp_words:
#     print(word)
# print(temp_words[0])
# print(temp_words[0][0])
# print(bool(re.search('['+'ace'+']', "abcdef")))


def get_attempt():
    global temp_words
    for letter_entry in letter_entries:
        letter = letter_entry.get()
        position = letter_entries.index(letter_entry)
        no_no_letters = no_no_letters_entry.get()

        # get rid of no no words
        if no_no_letters:
            temp_words_copy = temp_words.copy()
            for word in temp_words:
                if bool(re.search('[' + no_no_letters + ']', word)):
                    temp_words_copy.remove(word)
            temp_words = temp_words_copy

        if letter:
            limit_words(letter, position, is_sures[position].get(), no_no_letters)

        # print(position, letter, is_sures[position].get())

    print(temp_words.__len__())
    for word in temp_words:
        print(word)
    print("done")
    solutions_var.set(temp_words)


def limit_words(letter, position, is_sure, no_no_letters):
    global temp_words
    print("limiting ", letter, "...")

    if is_sure:
        # green letter
        temp_words_copy = temp_words.copy()

        for word in temp_words:
            if word[position] != letter or (no_no_letters and bool(re.search('['+no_no_letters+']', word))):
                temp_words_copy.remove(word)
    else:
        # yellow letter
        temp_words_copy = []
        for word in temp_words:
            if word[position] != letter and letter in word and (no_no_letters and not bool(re.search('['+no_no_letters+']', word))):
                temp_words_copy.append(word)

    temp_words = temp_words_copy


# GUI
main_window = Tk()
main_window.geometry('400x800')
main_window.title('Wordle Solver')

# widgets
solutions_var = StringVar()
solutions_var.set("Waiting...")

instructions_label = Label(main_window, text="Fill in letters that are yellow or green")
letter_label1 = Label(main_window, text="First letter")
letter_label2 = Label(main_window, text="Second letter")
letter_label3 = Label(main_window, text="Third letter")
letter_label4 = Label(main_window, text="Fourth letter")
letter_label5 = Label(main_window, text="Fifth letter")
no_no_label = Label(main_window, text="No no list (eg. abc)")
solutions_label = Label(main_window, textvariable=solutions_var, wraplength=50)

instructions_label.grid(row=0, column=1)
letter_label1.grid(row=1, column=0)
letter_label2.grid(row=2, column=0)
letter_label3.grid(row=3, column=0)
letter_label4.grid(row=4, column=0)
letter_label5.grid(row=5, column=0)
no_no_label.grid(row=7, column=0)
solutions_label.grid(row=9, column=1)

letter_entry1 = Entry(main_window)
letter_entry1.grid(row=1, column=1)
letter_entry2 = Entry(main_window)
letter_entry2.grid(row=2, column=1)
letter_entry3 = Entry(main_window)
letter_entry3.grid(row=3, column=1)
letter_entry4 = Entry(main_window)
letter_entry4.grid(row=4, column=1)
letter_entry5 = Entry(main_window)
letter_entry5.grid(row=5, column=1)
no_no_letters_entry = Entry(main_window)
no_no_letters_entry.grid(row=7, column=1)

letter_entries = [letter_entry1, letter_entry2, letter_entry3, letter_entry4, letter_entry5]

is_sure1 = BooleanVar(main_window, name="sure1")
is_sure_checkbox1 = Checkbutton(main_window, text="Is green", onvalue=True, offvalue=False, variable=is_sure1)
is_sure_checkbox1.grid(row=1, column=2)
is_sure2 = BooleanVar(main_window, name="sure2")
is_sure_checkbox2 = Checkbutton(main_window, text="Is green", onvalue=True, offvalue=False, variable=is_sure2)
is_sure_checkbox2.grid(row=2, column=2)
is_sure3 = BooleanVar(main_window, name="sure3")
is_sure_checkbox3 = Checkbutton(main_window, text="Is green", onvalue=True, offvalue=False, variable=is_sure3)
is_sure_checkbox3.grid(row=3, column=2)
is_sure4 = BooleanVar(main_window, name="sure4")
is_sure_checkbox4 = Checkbutton(main_window, text="Is green", onvalue=True, offvalue=False, variable=is_sure4)
is_sure_checkbox4.grid(row=4, column=2)
is_sure5 = BooleanVar(main_window, name="sure5")
is_sure_checkbox5 = Checkbutton(main_window, text="Is green", onvalue=True, offvalue=False, variable=is_sure5)
is_sure_checkbox5.grid(row=5, column=2)

main_window.setvar(name="sure1", value=False)
main_window.setvar(name="sure2", value=False)
main_window.setvar(name="sure3", value=False)
main_window.setvar(name="sure4", value=False)
main_window.setvar(name="sure5", value=False)

is_sures = [is_sure1, is_sure2, is_sure3, is_sure4, is_sure5]

button = Button(main_window, text='Solve', command=get_attempt)
button.grid(row=8, column=1)

# show GUI
main_window.mainloop()


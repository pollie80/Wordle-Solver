from tkinter import *

with open('fiveletterwords.txt', 'r') as f:
    temp_words = f.readlines().copy()

# print(temp_words[0])

def get_attempt():

    for letter_entry in letter_entries:
        letter = letter_entry.get()
        position = letter_entries.index(letter_entry)

        # if letter_entry.get():
        #     limit_words(letter, position, is_sure_checkboxes[position].getboolean())

        print(position, letter, is_sures[position].get())


def limit_words(letter, position, is_sure):
    print("doodoo")

# GUI
main_window = Tk()
main_window.geometry('400x400')
main_window.title('Wordle Solver')

## widgets
letter_entry1 = Entry(main_window)
letter_entry1.pack()
letter_entry2 = Entry(main_window)
letter_entry2.pack()
letter_entry3 = Entry(main_window)
letter_entry3.pack()
letter_entry4 = Entry(main_window)
letter_entry4.pack()
letter_entry5 = Entry(main_window)
letter_entry5.pack()

letter_entries = [letter_entry1, letter_entry2, letter_entry3, letter_entry4, letter_entry5]

is_sure1 = BooleanVar(main_window, name="sure1")
is_sure_checkbox1 = Checkbutton(main_window, text="Is green", onvalue=True, offvalue=False, variable=is_sure1)
is_sure_checkbox1.pack()
is_sure2 = BooleanVar(main_window, name="sure2")
is_sure_checkbox2 = Checkbutton(main_window, text="Is green", onvalue=True, offvalue=False, variable=is_sure2)
is_sure_checkbox2.pack()
is_sure3 = BooleanVar(main_window, name="sure3")
is_sure_checkbox3 = Checkbutton(main_window, text="Is green", onvalue=True, offvalue=False, variable=is_sure3)
is_sure_checkbox3.pack()
is_sure4 = BooleanVar(main_window, name="sure4")
is_sure_checkbox4 = Checkbutton(main_window, text="Is green", onvalue=True, offvalue=False, variable=is_sure4)
is_sure_checkbox4.pack()
is_sure5 = BooleanVar(main_window, name="sure5")
is_sure_checkbox5 = Checkbutton(main_window, text="Is green", onvalue=True, offvalue=False, variable=is_sure5)
is_sure_checkbox5.pack()

main_window.setvar(name="sure1", value=False)
main_window.setvar(name="sure2", value=False)
main_window.setvar(name="sure3", value=False)
main_window.setvar(name="sure4", value=False)
main_window.setvar(name="sure5", value=False)

is_sures = [is_sure1, is_sure2, is_sure3, is_sure4, is_sure5]

button = Button(main_window, text='Solve', command=get_attempt)
button.pack()

## show GUI
main_window.mainloop()


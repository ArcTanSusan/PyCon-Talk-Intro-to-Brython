# ----------------------------------------------------------
import time

from browser import doc
import browser.html as html

DB = {
    "REVISION" : 0
    , "STEPS" : {}
    , "STEPS_ORDERED" : []
    , "STEPS_COLORS" : []
    , "TASKS" : {}
    , "TASKS_COLORS" : []
    }

# tasks indexed by the DOM element id
tasks = {}

class Step:
    def __init__(self, desc, color):
        self.id = DB["REVISION"]
        DB["REVISION"] += 1
        self.desc = desc
        self.color = color
        self.tasks = []
        
    def add_task(self,desc,color,progress):
        self.tasks.append(Task(self.id,desc,color,progress))

    def draw(self,board,width):
        self.node = html.DIV(id=self.id, Class="step")
        self.node.style.width = percent(width)
        self.node.style.backgroundColor = self.color
        board <= self.node
    
        self.header = html.DIV(Class="step_header")
        self.node <= self.header
    
        self.title = html.PRE(self.desc, Class="step_title")
        self.header <= self.title
    
        self.count = html.PRE(0, id="step count %s" % self.id, Class="step_count")
        self.header <= self.count
    
        self.node.drop_id = self.id
        self.node.bind('drop',self.drag_drop)
        self.node.bind('dragover',self.drag_over)
        self.title.step = self
        self.title.step_node = self.node
        self.title.bind('click',self.task_create)
        
        for task in self.tasks:
            task.draw(self.node)

    def drag_over(self,ev):
        ev.preventDefault()
        ev.data.dropEffect = 'move'
    
    def drag_drop(self,ev):
        ev.preventDefault()
    
        src_id = ev.data['text']
        
        # move at DOM level
        src_node = doc[src_id]
        self.node <= src_node
    
    def task_create(self,ev):
        ev.stopPropagation()
        desc = prompt("New task", "%s %s" % (self.desc, time.strftime("%Y/%m/%d %H:%M:%S")))
        if desc:
            new_task = Task(self.id, desc, 0)
            new_task.draw(self.node)
    
class Task:

    def __init__(self,parent_id, desc, color, progress=0):
        
        self.id='task%s '%DB["REVISION"]
        tasks[self.id] = self
        DB['REVISION'] += 1
        self.parent_id = parent_id
        self.desc=desc
        self.color=color
        self.progress=progress
        self.tasks = []

    def add_task(self,desc,color,progress):
        self.tasks.append(Task(self.id,desc,color,progress))

    def get_parent(self):
        return self.parent_id

    def draw(self,parent_node):
        self.node = html.DIV(Class="task", Id=self.id, draggable=True)
        self.node.style.backgroundColor = DB["TASKS_COLORS"][self.color]
        parent_node <= self.node
    
        self.zprogress = html.DIV(Class="task_progress")
    
        self.progress_text = html.P("%d" % self.progress + "%", Class="task_progress_text")
        self.zprogress <= self.progress_text
    
        self.progress_bar = html.DIV(Class="task_progress_bar")
        self.progress_bar.style.width = percent(self.progress)
        self.zprogress <= self.progress_bar
    
        self.command_delete = html.DIV("X", Class="task_command_delete")
    
        self.command = html.TABLE(
            html.TR( html.TD(self.zprogress, Class="task_command") + html.TD(self.command_delete) )
            , Class="task_command"
            )
        self.node <= self.command
    
        self.zdesc = html.P(Class="task_desc")
        self.node <= self.zdesc
    
        self.node.drop_id = self.id
        self.node.task = self
        self.node.bind('dragstart',self.drag_start)
        self.node.bind('dragover',self.drag_over)
        self.node.bind('drop',self.drag_drop)
        self.node.bind('click',self.color_change)
        
        self.zprogress.task = self
        self.zprogress.bind('click',self.make_progress)
        
        self.command_delete.task = self
        self.command_delete.bind('click',self.task_delete)
        
        self.zdesc.task = self
        self.zdesc.desc = self.desc
        self.zdesc.bind('click',self.task_edit)
    
        self.set_text()
        
        for task in self.tasks:
            task.draw(self.node)

    def set_text(self):
        task_desc = self.zdesc
        clear_node(self.zdesc)
        self.zdesc.html = self.desc
        
    def color_change(self,ev):
        self.color = ( self.color + 1 ) % len(DB["TASKS_COLORS"])
        self.node.style.backgroundColor = DB["TASKS_COLORS"][self.color]
        ev.stopPropagation()

    def make_progress(self,ev):
        self.progress = ( self.progress + 25 ) % 125
        self.progress_bar.style.width = percent(self.progress)
        self.progress_text.text = percent(self.progress)
        ev.stopPropagation()
    
    def task_edit(self,ev):
        ev.stopPropagation()
        ret = prompt("Task", self.desc)
        if ret:
            self.desc = ret
            self.set_text()

    def drag_start(self,ev):
        ev.data['text'] = self.id
        ev.data.effectAllowed = 'move'
        ev.stopPropagation()

    def drag_over(self,ev):
        ev.preventDefault()
        ev.data.dropEffect = 'move'
    
    def drag_drop(self,ev):
        ev.preventDefault()
    
        src_id = ev.data['text']
        
        # move at DOM level
        self.node <= doc[src_id]
        
        ev.stopPropagation()

    def task_delete(self,ev):
        text = "Confirm deletion of: "+self.desc
        ret = confirm(text)
        if ret:
            del doc[self.id]

def dump():
    code = "DB = " + instance_repr(DB)
    popup_dump(code)

# ----------------------------------------------------------
def clear_node(node):
    for child in list(node):
        node.remove(child)

def draw_board(board):
    clear_node(board)

    width = 100 / len(steps)

    for step in steps:
        step.draw(board, width)

    for task in DB["TASKS"].values():
        tparent = task.get_parent()
        parent_node = doc[tparent.id]
        draw_task(task, parent_node)
    
    update_step_counters()

def update_step_counters():
    for step_id in DB["STEPS_ORDERED"]:
        step = DB["STEPS"][step_id]
        count = 0
        for task in DB["TASKS"].values():
            if task.parent_id == step.id:
                count += 1
        doc["step count %s" % step.id].text = count


# ----------------------------------------------------------
def percent(p):
    return ( "%d" % p ) + "%"

def instance_repr(o):
    if isinstance(o, dict):
        l = []
        for key, value in o.items():
            repr_key = instance_repr(key)
            repr_value = instance_repr(value)
            l.append( "%s : %s" % (repr_key, repr_value) )
        s = "{ %s }" % "\n, ".join(l)

    elif isinstance(o, list):
        l = []
        for i in o:
            repr_i = instance_repr(i)
            l.append(repr_i)
        s = "[ %s ]" % "\n, ".join(l)

    elif isinstance(o, set):
        l = []
        for i in o:
            repr_i = instance_repr(i)
            l.append(repr_i)
        s = "{ %s }" % "\n, ".join(l)

    elif isinstance(o, float):
        s = str(o)

    elif isinstance(o, int):
        s = str(o)

    elif isinstance(o, str):
        s = quoted_escape_string(o)

    else:
        attributes = dir(o)
        l = []
        for n in attributes:
            if not n.startswith("__"):
                repr_key = escape_string(n)
                repr_value = instance_repr( getattr(o, n) )
                l.append( "%s = %s" % (repr_key, repr_value) )
        s = "instance( %s )" % ", ".join(l)

    return s

def quoted_escape_string(s):
    s = "'%s'" % escape_string(s)
    return s

def escape_string(s):
    # TODO other control characters
    s = s.replace("'", "\\'")
    return s

# ----------------------------------------------------------
def nop(ev):
    return false





# ----------------------------------------------------------
def save_kanban():
    global DB
    local_storage["kanban"] = instance_repr(DB)

def load_kanban():
    global DB
    s = local_storage["kanban"]
    l = "DB = " + s
    eval(l)

    draw_board( doc["board"] )

# ----------------------------------------------------------
DB["STEPS_COLORS"] = [
    "#777777"
    , "#888888"
    , "#999999"
    , "#AAAAAA"
    , "#BBBBBB"
    , "#CCCCCC"
    ]

steps = []
for i,label in enumerate([
    "TODO",
    "SPECIFICATION",
    "DESIGN",
    "DEVELOPMENT",
    "VALIDATION",
    "READY"]):
    steps.append(Step(label,DB["STEPS_COLORS"][i]))

DB["TASKS_COLORS"] = [
    "#EE0000"
    , "#00CC00"
    , "#0088EE"
    , "#EEEE00"
    , "#EEA500"
   ]

steps[0].add_task('Project A<br>Add new Feature <b>A3</b>',0,0)
steps[0].add_task('Project B<br>Add new Feature <b>B2</b>',0,0)

steps[1].add_task('Project B<br>Feature <b>B1</b>',3,50)
steps[1].tasks[0].add_task('Check B1.1 with XXX',4,75)
steps[1].tasks[0].add_task('Wait for YYY to clarify B1.2',4,25)
steps[1].tasks[0].add_task('Started B1.3',2,25)

steps[2].add_task('A1',3,75)
steps[2].tasks[0].add_task('Dynamic design',2,75)
steps[2].tasks[0].add_task('Static design',1,100)

steps[3].add_task('A2 Coding',0,0)

steps[4].add_task('Project C',3,0)
steps[4].tasks[0].add_task('Waiting QA',4,0)

steps[5].add_task('Project D',1,100)

# ----------------------------------------------------------
draw_board( doc["board"] )


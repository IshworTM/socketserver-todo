import http.server
import socketserver
import random
import json

tasks = []

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/submit_form':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))

            input_element_value = data.get('message', False)
            status = data.get('status', '')
            date_time = data.get('datetime', '')

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()

            if input_element_value:
                self.append_to_list(input_element_value, status, date_time)

        elif self.path == '/edit-form':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            edit_button_id = data.get('message', '')
            # edited_task = str(data.get('key', ''))
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.update_status(edit_button_id)

        elif self.path == '/delete-form':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            delete_button_id = data.get('message', '')
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.delete_button(int(delete_button_id))

        elif self.path == '/update-status':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            status_index = int(data.get('message',''))

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.update_status(status_index)
        else:
            super().do_POST()

    def do_GET(self):
        if self.path == '/submit_form':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.return_response()
        else:
            super().do_GET()

    def return_response(self):
        html=""
        for index, task in enumerate(tasks):
            set_class = ''
            if task['status'] == 1:
                set_class = 'check'
            task_counter = index + 1
            date_and_time = (" ").join(task['datetime'].split("T"))
            html = html + f'<div class="task-container {set_class}"><span class="task-counter">{task_counter}. &nbsp;</span><div class="task-card" contenteditable="false">{task["key"]}<div class="date-time">{date_and_time}</div></div><div class="icons-section"><button class="edit-button" data-edit-id="{index}"><i class="material-icons edit-icon">edit</i></button><button class="done-button" data-done-id="{index}" style="display:none;"><i class="material-icons done-icon">done</i></button><button class="check-button" data-check-id="{index}"><i class="material-icons check-icon">check_box</i></button><button class="delete-button" data-delete-id="{index}"><i class="material-icons delete-icon">delete</i></button></div></div>'
        self.wfile.write(html.encode())

    def append_to_list(self, input_value, status_code, date_time):
        tasks.append({'key':input_value, 'status': status_code, 'datetime' : date_time})

    def update_status(self, task_index):
        if tasks[task_index]['status'] == 1:
            tasks[task_index]['status'] = 0
        else:
            tasks[task_index]['status'] = 1

    # def edit_form(self, edited_task):
    #     # if tasks[task_index]['status'] == 1:
    #     #     tasks[task_index]['status'] = 0
    #     # else:
    #     #     tasks[task_index]['status'] = 1
    #     for task in tasks:
    #         task["key"] = edited_task

    def delete_button(self, delete_id):
        deleted_item = tasks.pop(delete_id)
        print(f'{deleted_item} with the index {delete_id} was deleted from {tasks}')
        self.return_response()

port = random.randint(8000,8500)
directory = "."

handler = MyHandler

httpd = socketserver.TCPServer(("", port), handler)

print(f"Serving on http://localhost:{port}")

httpd.serve_forever()

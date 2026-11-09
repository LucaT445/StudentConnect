import urllib.request, urllib.error, json, uuid
from pathlib import Path
base='http://127.0.0.1:3000'
def call(method,path,data=None,status=200):
 req=urllib.request.Request(base+path,data=json.dumps(data).encode() if data is not None else None,headers={'Content-Type':'application/json'},method=method)
 try:
  with urllib.request.urlopen(req,timeout=20) as r:
   body=r.read(); assert r.status==status,(path,r.status); return json.loads(body)
 except urllib.error.HTTPError as e:
  assert e.code==status,(path,e.code,e.read()); return json.loads(e.read())
run=uuid.uuid4().hex[:8]
def register(role):
 user=dict(username=f'demo-{role}-{run}',email=f'{role}-{run}@example.test',password='SyntheticDemo123!',firstName='Demo',lastName=role.title(),role=role,pronouns='they/them')
 call('POST','/api/users',[user],201)
 call('POST','/api/login',dict(email=user['email'],password='incorrect'),400)
 return call('POST','/api/login',dict(email=user['email'],password=user['password']))['user']
t=register('teacher');s=register('student')
call('POST','/api/classes',dict(classID='DEMO-'+run,className='Synthetic Demo Course',teacherID=t['id']),201)
course=call('GET','/api/classes/get/'+t['id'])[0]; cid=course['_id']
call('POST','/api/classes/join',dict(classID=course['classID'],studentID=s['id']))
assert call('GET','/api/classes/get/'+s['id'])[0][0]['_id']==cid
for kind,route,author in [('announcement','announcement',t),('question','Question',s)]:
 call('POST','/api/classes/'+route+'/create',dict(authorID=author['id'],courseID=cid,datePosted='2026-11-09T12:00:00Z',title='Synthetic '+kind,message='Synthetic demo content',type=kind),201)
question=call('GET','/api/course/question/'+cid)[0]
assert call('GET','/api/course/announcement/'+cid)[0]['title']=='Synthetic announcement'
call('POST','/api/classes/Reply/create',dict(authorID=t['id'],courseID=cid,message='Synthetic answer',questionID=question['_id'],type='reply'),201)
reply=call('GET','/api/course/reply/get/'+question['_id'])[0][0]
call('POST','/api/reactions',dict(objectID=question['_id'],reactionType='Answered',reply=reply))
assert call('GET','/api/user/get/'+t['id'])==1
created=call('POST','/api/tasks',dict(task='Synthetic demo task',authorId=s['id']),201)['newTask']
assert any(x['_id']==created['_id'] for x in call('GET','/api/tasks/'+s['id']))
call('PUT','/api/tasks/'+created['_id'],dict(completed=True))
call('DELETE','/api/tasks/'+created['_id'])
assert not call('GET','/api/tasks/'+s['id'])
print('PASS: registration, valid/invalid login, create/join/list courses, announcements, questions, replies, reaction, karma, task create/list/complete/delete')
with open(Path('/tmp/studentconnect-demo-users.json'),'w') as f: json.dump({'teacher':t,'student':s,'course':course,'question':question,'password':'SyntheticDemo123!'},f)

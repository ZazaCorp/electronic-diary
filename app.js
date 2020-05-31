const storyList = document.querySelector('#stories');
const form = document.querySelector("#add-story");

//display info
function renderStories(doc){
  let li = document.createElement("li");
  let title = document.createElement("span");
  let mood = document.createElement("span");
  let story = document.createElement("span");
  let cross = document.createElement('div');

  li.setAttribute("data-id", doc.id);
  title.textContent = doc.data().title;
  mood.textContent = doc.data().mood;
  story.textContent = doc.data().story;
  cross.textContent = 'x';

  li.appendChild(title);
  li.appendChild(mood);
  li.appendChild(story);
  li.appendChild(cross);

  storyList.appendChild(li);

  //delete story
  cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('diary').doc(id).delete();
  })
}

//store data
form.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection("diary").add({
    title: form.title.value,
    mood: form.mood.value,
    story: form.story.value,
  });
  form.title.value = "";
  form.mood.value = "";
  form.story.value = "";
})


//real-time storage
db.collection('diary').orderBy('title').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if(change.type == 'added'){
      renderStories(change.doc);
    } else if (change.type == 'removed') {
        let li = storyList.querySelector('[data-id=' + change.doc.id +']');
        storyList.removeChild(li);
    }
  });

})

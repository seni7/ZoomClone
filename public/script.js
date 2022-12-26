const socket = io('/');

var myPeer = new Peer(undefined,{
  path: '/peerjs',
  host: '/',
  port: '3007',
});
const peers={};
// peers[0]="aaa"
// console.log(peers[userId])
const videoGrid=document.getElementById('video__grid')
const myVideo=document.createElement('video');
myVideo.muted=false;
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true,
}) .then((stream) => {
    myVideoStream=stream;
    addVideoStream(myVideo,stream);

    myPeer.on('call',(call) =>{

      call.answer(stream); // Answer the call with an A/V stream.
      
      const video=document.createElement('video')

      call.on('stream', (userVideoStream)=> {

            addVideoStream(video, userVideoStream)
        // Show stream in some video/canvas element.}
      });

      });

    socket.on('user-connected',(userId)=>{
      connectToNewUser(userId,stream);

    });

     let text = $('input');
     $('html').keydown(function(e){
      if(e.which == 13 && text.val().length !=0){
        socket.emit('message', text.val());
        text.val('');
      }
     });
     socket.on('creatMessage', (message) => {
      $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`);
     })

  });

  myPeer.on('open', (id) => {
      socket.emit('join-room', ROOM_ID, id)
  });
  socket.on('user-disconnected', (userId)=>{
    if (peers[userId]) {
        peers[userId].close();
    }
  });

  function addVideoStream(video,stream){
    video.srcObject=stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
  }

  function connectToNewUser(userId,stream){
    // console.log("joind on front", userId)
    const call = myPeer.call(userId, stream);
    const video=document.createElement('video')
    call.on('stream', (userVideoStream) => {
      addVideoStream(video,userVideoStream);
    });

    call.on('close',()=>{
      video.remove();
    });
    
    peers[userId]=call;

  }

  const playStop = () => {
    let enabled=myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled=false;
      setPlayVideo();
    }
    else{
      setStopVideo();
      myVideoStream.getVideoTracks()[0].enabled=true;
    }
  };

  const muteUnmute=()=>{
    const enabled=myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled=false;
      setUnmuteButton();
    }else{
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled=true;
    }
  };
  
  
  const setStopVideo=()=>{
    const html=` <i class="fas fa-video"></i>
    <span>Stop Video</span> `;
    document.querySelector('.main_video_button').innerHTML=html;
  };

  const setPlayVideo=()=>{
    const html=` <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span> `;
    document.querySelector('.main_video_button').innerHTML=html;
  };

  const setMuteButton=()=>{
    const html=` <i class="fas fa-microphone"></i>
    <span>Mute</span> `;
    document.querySelector('.main_mute_button').innerHTML=html;
  
  };

  const setUnmuteButton=()=>{
    const html=` <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span> `;
    document.querySelector('.main_mute_button').innerHTML=html;
  
  };


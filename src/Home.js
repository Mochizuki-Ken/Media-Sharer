import React,{useState} from 'react'
import './Home.css'
import { Img } from 'react-image';
import firebase from "./api/api";
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/storage'
// import * as securePin from "secure-pin";
export default function Home() {
    const [main_state,set_main_state]=useState(['none','none'])
    const [file,setFile]=useState({file:"none",type:'none',})

    const [sharing,set_sharing]=useState({state:false,id:0,pin:0})
    const [accepted,set_accepted]=useState({state:false})
    function upload(){
        if(file.file!=='none'){
            let pin=`${(Math.random()).toString()[5]}${(Math.random()).toString()[5]}${(Math.random()).toString()[5]}${(Math.random()).toString()[5]}${(Math.random()).toString()[5]}${(Math.random()).toString()[5]}`
            
            const documentRef= firebase.firestore().collection("media").doc()
            const fireRef=firebase.storage().ref(`/${file.type}/`+documentRef.id)
            const metadata={
                contentType:file.file.type
            };
            fireRef.put(file.file,metadata).then(()=>{
                fireRef.getDownloadURL().then((imgUrl)=>{
                    documentRef.set({
                        URL:imgUrl,
                        pin:pin,
                        type:file.type
                    }).then((e)=>{
                        set_sharing({state:true,id:documentRef.id,pin:pin,imgUrl})
                        set_main_state(['sharing','none'])
                    }).catch(err=>console.log(err))
                })
            })
        }
    }
    function del(){
        firebase.storage().refFromURL(sharing.imgUrl).delete()
        firebase.firestore().collection("media").doc(sharing.id).delete().then(()=>{
            set_main_state(['none','none'])
        })
        
    }
    function getMedia(){
        firebase.firestore().collection("media").where('pin','==',accepted.pinInput).onSnapshot((collectionSnapshot)=>{
            const data1=collectionSnapshot.docs.map(docSnapshot=>{
                const id=docSnapshot.id;
                return {...docSnapshot.data(),id}
            })
            set_accepted({state:true,URL:data1[0].URL,type:data1[0].type})
        })
    }
  return (
    <div className='Home-main-div'>
        <div className='main-div'>
            {main_state&&main_state[0]==='none'&&<div className='main-choose-div'>
                <button onClick={()=>{set_main_state(['acpt',main_state[1]])}}>Accept Media</button>
                <button onClick={()=>{set_main_state(['share',main_state[1]])}}>Share Media</button>
            </div>}
            {main_state&&main_state[0]==='acpt'&&!accepted.state&&<div className='acpt-main-div'>
                <input placeholder='Pin number:' onChange={(e)=>{set_accepted({state:false,pinInput:e.target.value})}}/>
                <div className='div'>
                    <button  onClick={()=>{set_main_state(['none',main_state[1]])}}>Back</button>
                    <button onClick={()=>{getMedia()}}>Get</button>
                </div>
                
            </div>}
            {main_state&&main_state[0]==='acpt'&&accepted.state&&<div className='acpt-main-div'>
                {accepted.type==='img'&&<div>
                    <Img src={accepted.URL} className='img'/>
                </div>}
                {accepted.type==='video'&&<div>
                    <video src={accepted.URL} controls className='video'/>
                </div>}
                {accepted.type==='audio'&&<div>
                    <audio controls className='audio'>
                        <source src={accepted.URL} />
                    </audio>
                </div>}
                <button onClick={()=>{set_accepted({state:false})}}>close</button>
                
            </div>}
            {main_state&&main_state[0]==='share'&&main_state[1]!=='true'&&<div className='share-main-div'>
                <div className='Div1'>
                    {/* image */}
                    <input type={'file'} onChange={(e)=>{setFile({file:e.target.files[0],type:'img',URL:URL.createObjectURL(e.target.files[0])});set_main_state(['media-preview','none'])}} accept="image/*" hidden id='img_up_btn'/>
                    <label for='img_up_btn' className='choose_btn'>IMG</label>
                    {/* video */}
                    <input type={'file'} onChange={(e)=>{setFile({file:e.target.files[0],type:'video',URL:URL.createObjectURL(e.target.files[0])});set_main_state(['media-preview','none'])}} accept="video/*" hidden id='video_up_btn'/>
                    <label for='video_up_btn' className='choose_btn'>VIDEO</label>
                    {/* audio */}
                    <input type={'file'} onChange={(e)=>{setFile({file:e.target.files[0],type:'audio',URL:URL.createObjectURL(e.target.files[0])});set_main_state(['media-preview','none'])}} accept="audio/*" hidden id='audio_up_btn'/>
                    <label for='audio_up_btn' className='choose_btn'>AUDIO</label>
                    {/* text */}
                    <label onClick={()=>{set_main_state([main_state[0],"true"])}} className='choose_btn'>TEXT</label>
                </div>
                
                <button className='bkb'  onClick={()=>{set_main_state(['none',main_state[1]])}}>back</button>
                
            </div>}

            {main_state&&main_state[0]==='media-preview'&&main_state[1]!=='true'&&file.file!=='none'&&<div className='share-main-div'>
                {console.log(file)}
                {file.type==='img'&&<div>
                    <Img src={file.URL} className='img'/>
                </div>}
                {file.type==='video'&&<div>
                    <video src={file.URL} controls className='video'/>
                </div>}
                {file.type==='audio'&&<div>
                    <audio controls className='audio'>
                        <source src={file.URL} />
                    </audio>
                </div>}
                <div>
                    <button className='bkb'  onClick={()=>{set_main_state(['share','none'])}}>Back</button>
                    <button className='bkb'  onClick={()=>{upload();}}>Upload</button>
                </div>
                
            </div>}

            {main_state&&main_state[0]==='share'&&main_state[1]==='true'&&<div className='share-main-div'>
                <input onChange={(e)=>{setFile({file:e.target.value,type:'text'})}} type={'text'}/>
                <div className='Div2'>
                    <button className='bkb' onClick={()=>{set_main_state([main_state[0],'none'])}}>Back</button>
                    <button className='bkb' onClick={()=>{}}>Send</button>
                </div>
            </div>}

            {main_state&&main_state[0]==='sharing'&&main_state[1]!=='true'&&<div className='share-main-div'>
                <label className='pin-label'>{sharing.pin}</label>
                {file.type==='img'&&<div>
                    <Img src={file.URL} className='img2'/>
                </div>}
                {file.type==='video'&&<div>
                    <video src={file.URL} controls className='video2'/>
                </div>}
                {file.type==='audio'&&<div>
                    <audio controls className='audio2'>
                        <source src={file.URL} />
                    </audio>
                </div>}
                <button onClick={()=>{del();}} className='end-btn'>End Sharing</button>
            </div>}
           
        </div>
    </div>
  )
}

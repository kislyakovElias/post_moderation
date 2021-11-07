import React, {useState, useRef, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Menu = ()=> (
    <div className={'info'}>
        <div>Press A to Approve post</div>
        <div>Press D to Disapprove post</div>
        <div>Press E to Escalate post</div>
        <div>Press F7 to Submit data to the server</div>
    </div>
)
const alertFull =()=> (
    alert('10 постов обработано, чтобы загрузить решения на сервер нажмите F7')
)

function Card({setModerated, moderated, index, setIndex, postData, array, setPage, page, fetchData, myRef, ...props}) {

    useEffect(()=>{
        document.getElementById('0')?.focus()
    },[moderated])

    const scrollToRef = (ref) => {
        window.scrollTo({top: ref?.current[index+1]?.offsetTop, behavior: "smooth"})
    };

    const executeScroll = () => {
        scrollToRef(myRef)
    };
    const executeScrollTo = (e) => {
        window.scrollTo({top: e.offsetTop, behavior: "smooth"})
    };

    const delayedActionExecute = (action, delay) => {
        return new Promise((resolve, reject) => {
            setTimeout(()=> {
                action = action;
                resolve();
            }, delay)
        })
    }

    const reasonBox = (i,status) => {
        let ta = document.createElement('textarea');
        let tn = document.createTextNode('причина : ');
        ta.appendChild(tn);
        myRef?.current[index]?.appendChild(ta)
        let btn = document.createElement('BUTTON',);
        btn.innerHTML = 'Ok';
        btn.onclick=function(){
            setModerated({
                ...moderated,
                [array[i].id]: {status: status, reason: ta.value}
            })
            document.getElementById(`${index+1}`)?.focus()
            window.scrollTo({top: myRef.current[index+1]?.offsetTop, behavior: "smooth"})
        }
        myRef?.current[index]?.appendChild(btn)
    }

    const switchKey = (e) => {
        switch (e.key){
            case 'a':{
                if (index >= array.length) {
                    if (index === array.length) {
                        setModerated({...moderated, [array[index - 1].id]: {status: 'approved'}})
                    }
                    alertFull()
                } else {
                    setModerated({...moderated, [array[index].id]: {status: 'approved'}})
                    setIndex((s) => s + 1)
                    executeScroll()
                } break;
            }
            case 'd':
            case 'D': { if (index >= array.length) {
                if (index === array.length) {
                    reasonBox(index-1,'disapproved')
                }
                alertFull()
            } else {
                reasonBox(index,'disapproved')
                setIndex((s) => s + 1)
            } break;
            }
            case 'e':
            case 'E': {if (index >= array.length - 1) {
                if (index === array.length) {
                    reasonBox(index-1,'escalated')
                }
                alertFull()
            } else {
                // <Modal/>
                reasonBox(index,'escalated')
                setIndex((s) => s + 1)
            } break;
            }
            case 'F7': {
                delayedActionExecute(postData(moderated),250)
                    .then(()=>delayedActionExecute(fetchData(),250))
                    .then(()=>delayedActionExecute(setIndex(0),100))
                    .then(()=>delayedActionExecute(setModerated([]), 100))
            }
                break;
        }
    }

    return (
        <div className={`flex-container`}
             tabIndex={0}
             id={index}
             onKeyDown={(e) => {switchKey(e)}}
             onClick={(e) => {
                 executeScrollTo(myRef.current[index] = e.target);
             }}>
            <div className={'cardbody'}>
                <div className="card-header">
                    {props.el.id} - Date {props.el.publishDateString},
                    <span className={'owner'}>owner: {props.el.ownerLogin}</span>
                </div>
                <div className={'flex-mini'}>
                    <div className="cardbody">
                        <h5 className="card-title">{props.el.bulletinSubject}</h5>
                        <p className="card-text">{props.el.bulletinText}.</p>
                    </div>
                    <span className={'imagebody'}>
                    <img src={props.el.bulletinImagees}/>
                 </span>
                </div>
            </div>
            <Menu/>
        </div>
    )
}

export default Card;
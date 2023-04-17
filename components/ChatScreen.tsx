'use client';
import { useState, useEffect } from 'react';
type TMessage = {
    type: 'human' | 'system';
    message: string;
    uuid: string;
}
type TMessages = TMessage[];

const Messages = ({ messages }: { messages: TMessages }) => {
    return (
        <ul className={'text-white'}>
            {messages.map(({ uuid, message }) => (
                <li key={uuid} className={'text-white'}>
                    {message}
                </li>
            ))}
        </ul>
    );
};

//generate a uuid
const uuid = () => {
    //a random letter
    const randomLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));
    const randomNumber = () => Math.floor(Math.random() * 10).toString();
    return randomLetter() + randomNumber() + randomLetter() + randomNumber();
}



/**
 * Chat UI
 *
 * @todo
 *  - Make it work with API
 *  - Integrate with loaders
 *  - Make it look good
 */
export default function ChatScreen() {
    //all the messages in the chat
    const [messages, setMessages] = useState<TMessages>([]);

    //track if is loading?
    const [isLoading, setIsLoading] = useState<boolean>(false);
    //when the user submits the form
    //add the message to the messages array
    //clear the form
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const message = e.currentTarget.message.value;
        setMessages([...messages, { uuid: uuid(), message, type: 'human' }]);
        e.currentTarget.reset();
    }

    //when message added to messages array
    //send to server
    useEffect(() => {
        if (Object.keys(messages).length === 0) return;
        setIsLoading(true);
        fetch('/api/ufoai/chat', {
            method: 'POST',
            body: JSON.stringify(messages),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                setIsLoading(false);

            }).catch(err => {
                console.log(err);
                setIsLoading(false);

            }
            );
    }, [messages])
    return (
        <>
            <div className="grid grid-rows-3 grid-flow-col gap-4">
                <div className="row-span-3 ">
                    <h2 className="text-2xl">Chat History</h2>
                </div>
                <div className="col-span-2">
                    <div className="flex flex-col h-screen justify-between">
                        <div className="h-10">
                            <Messages messages={messages} />
                        </div>
                        <div className={`h-10 ${isLoading ? 'animate-pulse': ''}`}>
                            <form onSubmit={handleSubmit}>
                                <div className='w-3/4'>
                                    <label htmlFor="message bg-blue-5000 w-full">Message</label>
                                    <input type="text" name="message" id="message" className="text-w" />
                                </div>
                                <div className="w-1/4">
                                    <button type="submit" >Send</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

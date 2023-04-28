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
        <ul className={' '}>
            {messages.map(({ uuid, message,type }) => (
                <li key={uuid} className={`${'system' === type ? 'transition-opacity ease-in duration-700 opacity-100': ''}`}>
                    <span>
                        {'human' === type ? '👩‍💻' : '🤖'}
                    </span>

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
                if( data.text ){
                    //Is loosing the human question
                    setMessages([...messages, { uuid: uuid(), message: data.text, type: 'system' }]);
                }
                setIsLoading(false);

            }).catch(err => {
                console.log(err);
                setIsLoading(false);

            }
        );
    }


    return (
        <>
            <div className="grid grid-rows-3 grid-flow-col gap-4">
                <div className="row-span-3 ">
                    <h2 className="text-2xl">Chat History</h2>
                    <h2 className="text-2xl">Documents</h2>
                </div>
                <div className="col-span-2">
                    <div className="flex flex-col h-screen justify-between">
                        <div className="h-10">
                            <Messages messages={messages} />
                            {isLoading && <p className="ease-in ease-out duration-700 opacity-100 ">Loading...</p>}
                        </div>
                        <div className={`h-10 ${isLoading ? 'animate-pulse': ''}`}>
                            <form onSubmit={handleSubmit}>
                                <div className='w-3/4'>
                                    <label htmlFor="message bg-blue-5000 w-full">Message</label>
                                    <input type="text" name="message" id="message" className="text-black border-2 border-black" />
                                </div>
                                <div className="w-1/4">
                                <input type="reset" value="Reset" className="text-black border-2 border-black"  />
                                <button type="submit" className="text-black border-2 border-black">Send</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

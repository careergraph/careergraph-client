import { useState } from "react";
import chatbotButtonIcon from "../../assets/logo.svg";
import ChatPanel from "~/components/Chat/ChatPanel";

export default function ChatBotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <style>{`
            @keyframes shine {
                0% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0% 50%;
                }
            }

            .button-bg {
                background: conic-gradient(from 0deg, #00F5FF, #FF00C7, #FFD700, #00FF85, #8A2BE2, #00F5FF); 
                background-size: 300% 300%;
                animation: shine 4s ease-out infinite;
            }
            `}</style>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="button-bg rounded-full p-0.5 hover:scale-105 transition duration-300 active:scale-100">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-lg hover:shadow-blue-400/50"
            aria-label="Trợ lý AI"
          >
            <img
              src={chatbotButtonIcon}
              alt="Trợ lý AI"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>

      <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

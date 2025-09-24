import React, { useState } from "react";
import { Send, ChevronRight } from "lucide-react";

// Types
interface Message {
  message: string;
  type: "sent" | "received";
}

interface EmptyStateProps {
  onMessageClick: (message: string) => void;
}

// Mock schema validation - simplified version
const validateMessage = (message: string): string | null => {
  if (!message || message.trim().length === 0) {
    return "Message cannot be empty";
  }
  if (message.length > 500) {
    return "Message too long";
  }
  return null;
};

// EmptyState component matching the image design
const EmptyState: React.FC<EmptyStateProps> = ({ onMessageClick }) => {
  const recentChats: string[] = [
    "List of cinemas",
    "Businesses that offer home services to",
  ];

  const exploreMore: string[] = [
    "Date ideas in Abuja",
    "Nice places to visit in Abuja",
  ];

  return (
    <div className="flex flex-col h-full bg-gray-100 p-6">
      {/* Greeting Section */}
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center mr-4">
          <span className="text-2xl">👩‍💼</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Good day</h1>
      </div>

      {/* Recent chats Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent chats</h2>
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex flex-wrap gap-3">
          {recentChats.map((chat: string, index: number) => (
            <button
              key={index}
              onClick={() => onMessageClick(chat)}
              className="px-4 py-3 bg-white rounded-full text-gray-700 text-sm hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
            >
              {chat}
            </button>
          ))}
        </div>
      </div>

      {/* Explore more Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Explore more</h2>
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex flex-wrap gap-3">
          {exploreMore.map((item: string, index: number) => (
            <button
              key={index}
              onClick={() => onMessageClick(item)}
              className="px-4 py-3 bg-white rounded-full text-gray-700 text-sm hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ExploreAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  const handleMessageSubmit = (message: string): void => {
    console.log("Message would be sent:", message);

    // Add user message to UI
    setMessages((prevMessages: Message[]) => [
      ...prevMessages,
      { message: message, type: "sent" },
    ]);
  };

  const handleFormSubmit = (): void => {
    const validationError: string | null = validateMessage(inputMessage);
    if (validationError) {
      return;
    }

    handleMessageSubmit(inputMessage);
    setInputMessage("");
  };

  const handleEmptyStateMessageClick = (message: string): void => {
    setInputMessage(message);
    handleMessageSubmit(message);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputMessage(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  return (
    <div className="flex flex-col justify-between h-full">
      {messages.length > 0 ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
            {messages?.map((message: Message, index: number) => (
              <div
                key={index}
                className={`
                  text-sm md:text-base
                  m-2
                  p-4
                  rounded-[10px]
                  max-w-xs md:max-w-md
                  ${
                    message.type === "sent"
                      ? "bg-bg-primary-dark2 text-white ml-auto"
                      : "bg-white text-text-primary mr-auto shadow-sm"
                  }
                `}
              >
                {message.message}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <EmptyState onMessageClick={handleEmptyStateMessageClick} />
        </div>
      )}

      {/* Bottom Input Field */}
      <div>
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type in your message"
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              className="w-full px-4 py-3 text-text-primary border border-border-primary rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleFormSubmit}
            disabled={!inputMessage.trim()}
            className="w-12 h-12 bg-bg-primary-dark2 hover:bg-bg-primary-dark2/80 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExploreAI;

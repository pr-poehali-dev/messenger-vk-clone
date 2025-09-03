import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  participants?: User[];
}

const Index = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });

  const mockUsers: User[] = [
    { id: '1', name: 'Алексей Петров', status: 'online' },
    { id: '2', name: 'Мария Сидорова', status: 'away', lastSeen: '2 мин назад' },
    { id: '3', name: 'Команда разработки', status: 'online' },
    { id: '4', name: 'Дмитрий Иванов', status: 'offline', lastSeen: '1 час назад' },
  ];

  const mockChats: Chat[] = [
    {
      id: '1',
      name: 'Алексей Петров',
      isGroup: false,
      unreadCount: 2,
      lastMessage: {
        id: '1',
        senderId: '1',
        text: 'Привет! Как дела с проектом?',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false
      }
    },
    {
      id: '2',
      name: 'Команда разработки',
      isGroup: true,
      unreadCount: 0,
      lastMessage: {
        id: '2',
        senderId: '3',
        text: 'Мария: Отлично, завтра релиз!',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: true
      }
    },
    {
      id: '3',
      name: 'Мария Сидорова',
      isGroup: false,
      unreadCount: 0,
      lastMessage: {
        id: '3',
        senderId: '2',
        text: 'Увидимся завтра на встрече',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true
      }
    },
  ];

  const mockMessages: Message[] = [
    {
      id: '1',
      senderId: '1',
      text: 'Привет! Как дела с проектом?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isRead: true
    },
    {
      id: '2',
      senderId: 'me',
      text: 'Привет! Всё отлично, почти готово 🚀',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: true
    },
    {
      id: '3',
      senderId: '1',
      text: 'Супер! Жду с нетерпением',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isRead: false
    }
  ];

  const emojis = ['😊', '😄', '😍', '🤔', '👍', '❤️', '🔥', '🎉', '😂', '🚀', '💪', '✨'];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Отправка сообщения:', newMessage);
      setNewMessage('');
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleAuth = () => {
    // Мокап авторизации
    if (authForm.email && authForm.password) {
      setIsAuthenticated(true);
      setShowAuthModal(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-purple-100">
        <Card className="w-96 p-6 shadow-xl">
          <div className="text-center mb-6">
            <Icon name="MessageCircle" size={48} className="text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Добро пожаловать</h1>
            <p className="text-gray-600">Войдите в свой аккаунт или создайте новый</p>
          </div>
          
          <div className="space-y-4">
            {authMode === 'register' && (
              <Input
                placeholder="Имя"
                value={authForm.name}
                onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={authForm.email}
              onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={authForm.password}
              onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
            />
            
            <Button onClick={handleAuth} className="w-full">
              {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="w-full"
            >
              {authMode === 'login' ? 'Создать аккаунт' : 'Уже есть аккаунт?'}
            </Button>
          </div>
          
          <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-700">
              ⚠️ Демо режим: введите любой email и пароль
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 font-sans relative">
      {/* Кнопка назад для полноэкранного режима */}
      {isFullscreen && (
        <Button
          variant="ghost"
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 left-4 z-50 bg-white shadow-md"
        >
          <Icon name="ArrowLeft" size={20} />
        </Button>
      )}
      
      <div className={`h-screen flex bg-gray-50 font-sans transition-all duration-300 ${
        isFullscreen ? 'absolute inset-0 z-40' : ''
      }`}>
      {/* Левая панель - список чатов */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isFullscreen ? 'w-0 overflow-hidden' : 'w-1/3'
      }`}>
        {/* Заголовок */}
        <div className="p-4 border-b border-gray-200 bg-primary text-white">
          <h1 className="text-xl font-semibold">Мессенджер</h1>
          <div className="flex items-center gap-2 mt-2">
            <Icon name="Users" size={16} />
            <span className="text-sm opacity-90">Онлайн: {mockUsers.filter(u => u.status === 'online').length}</span>
          </div>
        </div>

        {/* Поиск */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-3 text-gray-400" />
            <Input 
              placeholder="Поиск сообщений..." 
              className="pl-10 bg-gray-50 border-0"
            />
          </div>
        </div>

        {/* Список чатов */}
        <ScrollArea className="flex-1">
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChat(chat.id);
                setIsFullscreen(true);
              }}
              className={`p-3 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                activeChat === chat.id ? 'bg-accent' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary text-white">
                      {chat.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {chat.isGroup && (
                    <Icon name="Users" size={14} className="absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{chat.name}</h3>
                    {chat.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatTime(chat.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage?.text}
                    </p>
                    {chat.unreadCount > 0 && (
                      <Badge className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Центральная панель - чат */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Заголовок чата */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary text-white">
                    {mockChats.find(c => c.id === activeChat)?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">
                    {mockChats.find(c => c.id === activeChat)?.name}
                  </h2>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    онлайн
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Icon name="Phone" size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="Video" size={16} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="MoreVertical" size={16} />
                </Button>
              </div>
            </div>

            {/* Сообщения */}
            <ScrollArea className="flex-1 p-4 bg-gray-50">
              <div className="space-y-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.senderId === 'me'
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-900 shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <div className="flex items-center justify-end mt-1 gap-1">
                        <span className={`text-xs ${
                          message.senderId === 'me' ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </span>
                        {message.senderId === 'me' && (
                          <Icon 
                            name={message.isRead ? "CheckCheck" : "Check"} 
                            size={12} 
                            className={message.isRead ? 'text-blue-300' : 'text-white/80'}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Ввод сообщения */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="mb-2"
                >
                  <Icon name="Smile" size={20} />
                </Button>
                
                <div className="flex-1">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Напишите сообщение..."
                    className="bg-gray-100 border-0 rounded-full"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  
                  {/* Панель эмодзи */}
                  {showEmojiPicker && (
                    <Card className="absolute bottom-16 left-4 p-3 shadow-lg z-10">
                      <div className="grid grid-cols-6 gap-2">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addEmoji(emoji)}
                            className="p-2 hover:bg-gray-100 rounded text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>

                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="rounded-full"
                >
                  <Icon name="Send" size={16} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Icon name="MessageCircle" size={64} className="text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-600 mb-2">
                Выберите чат для начала общения
              </h2>
              <p className="text-gray-500">
                Выберите диалог из списка слева или найдите пользователя
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Правая панель - контакты и статусы */}
      <div className={`bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ${
        isFullscreen ? 'w-0 overflow-hidden' : 'w-80'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Icon name="Users" size={20} />
            Контакты
          </h3>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {mockUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-secondary text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    user.status === 'online' ? 'bg-green-500' : 
                    user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{user.name}</h4>
                  <p className="text-sm text-gray-500">
                    {user.status === 'online' ? 'В сети' : user.lastSeen || 'Не в сети'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-sm text-gray-600 mb-3 flex items-center gap-2">
              <Icon name="Clock" size={16} />
              Истории
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Icon name="Plus" size={16} className="text-white" />
                </div>
                <span className="text-sm font-medium">Добавить историю</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                  <Avatar className="w-full h-full">
                    <AvatarFallback className="bg-white text-black text-xs">М</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <p className="text-sm font-medium">Мария</p>
                  <p className="text-xs text-gray-500">5 мин назад</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
    </div>
  );
};

export default Index;
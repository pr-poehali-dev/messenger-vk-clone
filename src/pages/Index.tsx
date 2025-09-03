import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  bio?: string;
  joinDate: Date;
  isBanned?: boolean;
  role: 'user' | 'admin';
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
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profileForm, setProfileForm] = useState({ name: '', bio: '', avatar: '' });

  // База данных пользователей (мокап)
  const [users, setUsers] = useState<User[]>([
    {
      id: 'admin',
      name: 'Himo',
      email: 'himo@messenger.com',
      status: 'online',
      bio: 'Администратор системы',
      joinDate: new Date('2024-01-01'),
      role: 'admin'
    }
  ]);

  // Пустой список чатов по умолчанию
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

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
    if (authForm.email && authForm.password) {
      // Проверка админ аккаунта
      if (authForm.email === 'himo@admin.com' && authForm.password === '12345678') {
        const adminUser = users.find(u => u.id === 'admin');
        if (adminUser) {
          setCurrentUser(adminUser);
          setProfileForm({ name: adminUser.name, bio: adminUser.bio || '', avatar: adminUser.avatar || '' });
        }
      } else {
        // Обычный пользователь
        const newUser: User = {
          id: Date.now().toString(),
          name: authForm.name || 'Пользователь',
          email: authForm.email,
          status: 'online',
          joinDate: new Date(),
          role: 'user'
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        setProfileForm({ name: newUser.name, bio: '', avatar: '' });
      }
      
      setIsAuthenticated(true);
    }
  };

  const handleSaveProfile = () => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        name: profileForm.name,
        bio: profileForm.bio,
        avatar: profileForm.avatar
      };
      
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      setShowProfileModal(false);
    }
  };

  const handleBanUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isBanned: !u.isBanned } : u
    ));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
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
          
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium mb-2">
              🔑 Админ доступ:
            </p>
            <p className="text-xs text-blue-600">
              Email: himo@admin.com<br />
              Пароль: 12345678
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
          {/* Заголовок с профилем */}
          <div className="p-4 border-b border-gray-200 bg-primary text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-white text-primary font-semibold">
                    {currentUser?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-semibold">{currentUser?.name}</h1>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm opacity-90">онлайн</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfileModal(true)}
                  className="text-white hover:bg-white/20"
                >
                  <Icon name="User" size={16} />
                </Button>
                {currentUser?.role === 'admin' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAdminPanel(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Icon name="Shield" size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Поиск */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-3 text-gray-400" />
              <Input 
                placeholder="Поиск чатов..." 
                className="pl-10 bg-gray-50 border-0"
              />
            </div>
          </div>

          {/* Список чатов */}
          <ScrollArea className="flex-1">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500">
                <Icon name="MessageCircle" size={48} className="mb-4 opacity-50" />
                <p className="text-center">
                  Нет активных чатов<br />
                  <span className="text-sm">Начните новый диалог</span>
                </p>
              </div>
            ) : (
              chats.map((chat) => (
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
                  {/* Чат карточка */}
                </div>
              ))
            )}
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
                      Ч
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">Выберите чат</h2>
                    <span className="text-sm text-gray-500">для начала общения</span>
                  </div>
                </div>
              </div>

              {/* Сообщения */}
              <ScrollArea className="flex-1 p-4 bg-gray-50">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <Icon name="MessageSquare" size={64} className="mx-auto mb-4 opacity-30" />
                    <p>Выберите собеседника для начала общения</p>
                  </div>
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
                  Добро пожаловать в мессенджер!
                </h2>
                <p className="text-gray-500">
                  Создайте новый чат или найдите собеседника
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Правая панель - контакты */}
        <div className={`bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ${
          isFullscreen ? 'w-0 overflow-hidden' : 'w-80'
        }`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Icon name="Users" size={20} />
              Пользователи онлайн
            </h3>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {users.filter(u => u.id !== currentUser?.id && !u.isBanned).map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-secondary text-white">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate flex items-center gap-2">
                      {user.name}
                      {user.role === 'admin' && (
                        <Badge className="bg-primary text-white text-xs px-1 py-0">
                          ADMIN
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-gray-500">В сети</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Модал профиля */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать профиль</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-primary text-white text-2xl">
                  {profileForm.name.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <Input
              placeholder="Имя"
              value={profileForm.name}
              onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
            />
            
            <Textarea
              placeholder="О себе"
              value={profileForm.bio}
              onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
            />
            
            <Input
              placeholder="Ссылка на аватар"
              value={profileForm.avatar}
              onChange={(e) => setProfileForm(prev => ({ ...prev, avatar: e.target.value }))}
            />
            
            <div className="flex gap-2">
              <Button onClick={handleSaveProfile} className="flex-1">
                Сохранить
              </Button>
              <Button variant="outline" onClick={() => setShowProfileModal(false)} className="flex-1">
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Админ панель */}
      <Dialog open={showAdminPanel} onOpenChange={setShowAdminPanel}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Shield" size={20} />
              Панель администратора
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users">Пользователи</TabsTrigger>
              <TabsTrigger value="stats">Статистика</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4">
              <ScrollArea className="h-96">
                {users.filter(u => u.id !== currentUser?.id).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        {user.isBanned && (
                          <Badge className="bg-red-100 text-red-700 text-xs">
                            ЗАБЛОКИРОВАН
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={user.isBanned ? "default" : "destructive"}
                        onClick={() => handleBanUser(user.id)}
                      >
                        {user.isBanned ? 'Разбан' : 'Бан'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <h3 className="text-2xl font-bold text-primary">{users.length}</h3>
                  <p className="text-sm text-gray-600">Всего пользователей</p>
                </Card>
                <Card className="p-4 text-center">
                  <h3 className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.status === 'online').length}
                  </h3>
                  <p className="text-sm text-gray-600">Онлайн</p>
                </Card>
                <Card className="p-4 text-center">
                  <h3 className="text-2xl font-bold text-red-600">
                    {users.filter(u => u.isBanned).length}
                  </h3>
                  <p className="text-sm text-gray-600">Заблокировано</p>
                </Card>
                <Card className="p-4 text-center">
                  <h3 className="text-2xl font-bold text-orange-600">{chats.length}</h3>
                  <p className="text-sm text-gray-600">Активных чатов</p>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { User } from '@/types/user';
import { CellRenderer, CellEditor } from '@/types/grid';

interface UserCellProps {
  value: User[];
  onChange?: (users: User[]) => void;
  isEditing?: boolean;
}

const UserAvatar: React.FC<{ user: User; size?: number }> = ({ user, size = 24 }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <Image
      src={user.avatar}
      alt={user.name}
      fill
      className="rounded-full object-cover"
    />
  </div>
);

export const UserCellRenderer: CellRenderer = {
  render: (value: User[]) => {
    if (!value?.length) return <span className="text-gray-400">Unassigned</span>;

    return (
      <div className="flex items-center gap-1 group relative">
        <div className="flex -space-x-2">
          {value.slice(0, 3).map((user) => (
            <div key={user.id} className="relative" style={{ width: 24, height: 24 }}>
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                className="rounded-full object-cover border-2 border-white"
              />
            </div>
          ))}
        </div>
        {value.length > 3 && (
          <span className="text-sm text-gray-500">+{value.length - 3}</span>
        )}
        <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-white shadow-lg rounded-lg p-2 z-10 min-w-[200px]">
          {value.map((user) => (
            <div key={user.id} className="flex items-center gap-2 py-1">
              <UserAvatar user={user} />
              <div>
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const UserCellEditor: CellEditor = {
  edit: (value: User[], row: any, onChange: (users: User[]) => void) => {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<User[]>(value || []);
    const searchTimeout = useRef<NodeJS.Timeout>();

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch(`/api/users?query=${search}&limit=5`);
          if (!response.ok) throw new Error('Failed to fetch users');
          const data = await response.json();
          setUsers(data.users);
        } catch (err) {
          setError('Failed to load users');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      searchTimeout.current = setTimeout(fetchUsers, 300);
    }, [search]);

    const toggleUser = (user: User) => {
      const isSelected = selectedUsers.some((u) => u.id === user.id);
      const newUsers = isSelected
        ? selectedUsers.filter((u) => u.id !== user.id)
        : [...selectedUsers, user];
      setSelectedUsers(newUsers);
      onChange(newUsers);
    };

    return (
      <div className="w-[300px] bg-white rounded-lg shadow-lg p-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-1 bg-blue-50 rounded-full px-2 py-1"
            >
              <UserAvatar user={user} size={20} />
              <span className="text-sm">{user.name}</span>
              <button
                onClick={() => toggleUser(user)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-2 max-h-[200px] overflow-y-auto">
          {loading ? (
            <div className="text-center py-2 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-2 text-red-500">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-center py-2 text-gray-500">No users found</div>
          ) : (
            users.map((user) => (
              <button
                key={user.id}
                onClick={() => toggleUser(user)}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 ${
                  selectedUsers.some((u) => u.id === user.id)
                    ? 'bg-blue-50'
                    : ''
                }`}
              >
                <UserAvatar user={user} />
                <div className="text-left">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  },
}; 
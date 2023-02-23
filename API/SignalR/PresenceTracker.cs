namespace API.SignalR
{
    public class PresenceTracker
    {
        private static readonly Dictionary<string, List<string>> OnlineUsers =
            new Dictionary<string, List<string>>();

        public Task UserConnected(string username, string connectionId){

            lock(OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(username))
                {
                    OnlineUsers[username].Add(connectionId);
                }
                else{ //if the users dont already have a key inside the dictionary then we make a new dictionay item
                    OnlineUsers.Add(username, new List<string>{connectionId});
                }

                return Task.CompletedTask;

            }
            
        }


        public Task UserDisConnected(string username, string connectionId){

            lock(OnlineUsers)
            {
                if (!OnlineUsers.ContainsKey(username)) return Task.CompletedTask; // if the username is not in our dictionary then we dont do any thing

                //if the user is int our dictionary then we remove it
                OnlineUsers[username].Remove(connectionId);   

                if (OnlineUsers[username].Count == 0)
                {
                    OnlineUsers.Remove(username);
                }             

                return Task.CompletedTask;

            }
            
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;
            lock (OnlineUsers)
            {
                onlineUsers = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }
            
            return Task.FromResult(onlineUsers);
        }


        
    }
}
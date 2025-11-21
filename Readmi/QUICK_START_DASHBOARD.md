# 🚀 Quick Start Guide - Enhanced Dashboard

## Prerequisites
- MongoDB installed and running
- Node.js and npm installed
- Port 5000 (backend) and 5173 (frontend) available

---

## Step 1: Start MongoDB
```bash
# Windows (if MongoDB is installed as service)
net start MongoDB

# Or run manually
mongod
```

---

## Step 2: Seed Sample Data
```bash
# Navigate to server directory
cd "d:\Industry Project\Sales Enquiry\server"

# Run the seeding script
npm run seed
```

**Expected Output:**
```
🚀 Starting database seeding...
✅ MongoDB Connected Successfully
✅ Created 10 sample users
✅ Created 200 sample enquiries
✨ Database seeding completed successfully!

📝 Login Credentials:
   Admin: admin@example.com / admin123
   Sales: rajesh@example.com / sales123
   R&D: arun@example.com / rnd123
   Management: suresh@example.com / mgmt123
```

---

## Step 3: Start Backend Server
```bash
# In server directory
npm run dev
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected
```

---

## Step 4: Start Frontend (New Terminal)
```bash
# Navigate to client directory
cd "d:\Industry Project\Sales Enquiry\client"

# Start development server
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

---

## Step 5: Access Dashboard

1. Open browser: `http://localhost:5173`
2. Login with credentials:
   - **Email**: admin@example.com
   - **Password**: admin123
3. You'll see the dashboard with:
   - ✅ 4 stat cards (Total, Open, Quoted, Regretted)
   - 📈 Monthly trend line chart
   - 👥 Sales team performance bar chart
   - 🔬 R&D team performance bar chart
   - 🎯 Activity distribution doughnut chart
   - 🌍 Market distribution pie chart
   - 📊 Performance highlights

---

## 🎨 Dashboard Features You'll See

### Statistics Cards
- **Total Enquiries**: ~200 (based on seed data)
- **Open Enquiries**: Active enquiries
- **Quoted Enquiries**: Successfully quoted
- **Regretted Enquiries**: Declined enquiries

### Charts
1. **Monthly Trends** - Shows Jan-Sep 2025 data
2. **Sales Team Performance** - Top 10 performers
3. **R&D Team Performance** - All R&D members
4. **Activity Distribution** - Quoted/Regretted/In Progress/On Hold
5. **Market Distribution** - Domestic vs Export split

### Performance Metrics
- Success Rate percentage
- Rejection Rate percentage
- Active team members count

---

## 🔄 Re-seeding Data (Optional)

If you want to clear and re-seed the database:

```bash
# Option 1: Manual cleanup
# Connect to MongoDB and drop collections
mongo sales-enquiry
db.users.drop()
db.enquiries.drop()
exit

# Then run seed again
npm run seed

# Option 2: Modify seed script
# Edit server/scripts/seedData.js
# Uncomment these lines (around line 127):
# await User.deleteMany({});
# await Enquiry.deleteMany({});
```

---

## 📱 Testing Different User Roles

### Admin User
- **Email**: admin@example.com
- **Password**: admin123
- **Access**: Full dashboard, all features

### Sales User
- **Email**: rajesh@example.com
- **Password**: sales123
- **Access**: Dashboard, own enquiries

### R&D User
- **Email**: arun@example.com
- **Password**: rnd123
- **Access**: Dashboard, assigned enquiries

### Management User
- **Email**: suresh@example.com
- **Password**: mgmt123
- **Access**: Dashboard, reports

---

## 🐛 Troubleshooting

### Problem: "MongoDB Connection Error"
**Solution:**
```bash
# Check if MongoDB is running
net start MongoDB
# or
mongod --dbpath "C:\data\db"
```

### Problem: "Charts Not Showing"
**Solution:**
- Wait for data to load (check browser console)
- Verify backend API is running (http://localhost:5000/health)
- Check if seed data was created successfully

### Problem: "Port 5000 Already in Use"
**Solution:**
```bash
# Find and kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Problem: "Port 5173 Already in Use"
**Solution:**
- Vite will automatically use next available port (5174, 5175, etc.)
- Or kill the process using port 5173

---

## 🎯 What to Expect

### Dashboard Loading Sequence
1. **First**: Loading spinner appears
2. **Second**: Stat cards populate with numbers
3. **Third**: Charts render one by one
4. **Fourth**: Performance highlights calculate and display

### Chart Interactions
- **Hover**: See detailed tooltips
- **Click Legend**: Toggle datasets on/off
- **Responsive**: Charts resize on window change

### Data Refresh
- Currently: Manual refresh (reload page)
- Future: Real-time updates with WebSocket

---

## 📊 Understanding the Data

### Sample Data Characteristics
- **Date Range**: January 2025 - September 2025
- **Total Enquiries**: 200
- **Distribution**:
  - ~40% Quoted
  - ~20% Regretted
  - ~30% In Progress
  - ~10% On Hold
- **Market Split**: ~50% Domestic, ~50% Export
- **Product Types**: Mixed (SP, NSP, SP+NSP, Other)

---

## 🚀 Next Steps

1. **Explore Other Pages**:
   - Click "Enquiries" in sidebar (placeholder - to be implemented)
   - Click "Users" (admin only - placeholder)
   - Click "Reports" (placeholder)

2. **Test Authentication**:
   - Logout and login with different users
   - Notice role-based menu differences

3. **Check Profile**:
   - Click avatar in top right
   - View user information

4. **API Testing**:
   - Test endpoints: http://localhost:5000/api/dashboard/stats
   - Use Postman or browser dev tools

---

## 📝 Development Tips

### Hot Reload
- Frontend: Vite provides instant hot reload
- Backend: Nodemon restarts on file changes

### Making Changes
- **Add Charts**: Edit `client/src/pages/Dashboard/Dashboard.jsx`
- **Modify API**: Edit `server/controllers/dashboardController.js`
- **Change Colors**: Edit `client/src/App.jsx` theme
- **Add Data**: Modify `server/scripts/seedData.js`

### Debugging
```javascript
// Add console logs in Dashboard.jsx
console.log('Stats:', stats);
console.log('Team Performance:', teamPerformance);
console.log('Market Analysis:', marketAnalysis);
console.log('Trend Analysis:', trendAnalysis);
```

---

## 🎉 Success Checklist

- ✅ MongoDB running
- ✅ Sample data seeded (200 enquiries, 10 users)
- ✅ Backend server running on port 5000
- ✅ Frontend running on port 5173
- ✅ Can login with admin credentials
- ✅ Dashboard shows all 5 charts
- ✅ Statistics cards display numbers
- ✅ Charts are interactive (hover works)
- ✅ Performance highlights calculated correctly

---

## 📞 Need Help?

1. **Check Logs**:
   - Backend: Terminal running `npm run dev`
   - Frontend: Browser console (F12)

2. **Verify Data**:
   ```bash
   # Connect to MongoDB
   mongo sales-enquiry
   # Check collections
   db.users.countDocuments()
   db.enquiries.countDocuments()
   ```

3. **Reset Everything**:
   ```bash
   # Stop all servers (Ctrl+C)
   # Drop database
   mongo sales-enquiry --eval "db.dropDatabase()"
   # Re-seed
   cd server
   npm run seed
   # Restart servers
   ```

---

**Enjoy your enhanced dashboard with beautiful charts! 📊✨**

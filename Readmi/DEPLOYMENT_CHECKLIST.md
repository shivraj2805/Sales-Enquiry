# 🚀 Deployment Checklist

## Pre-Deployment Steps

### ✅ Dependencies Installed
- [x] Backend: `exceljs` installed
- [x] Frontend: `@mui/x-data-grid` installed

### ⏳ Next Steps to Get Running

#### 1. Verify MongoDB is Running
```powershell
# Check if MongoDB service is running
# If using MongoDB Compass, check connection to localhost:27017
```

#### 2. Create Environment File
```powershell
# Create server/.env file with:
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sales-enquiry
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
```

#### 3. Import Data (Choose One)

**Option A: Import from Excel File**
```powershell
cd server
npm run import
```

**Option B: Use Sample Data**
```powershell
cd server
npm run seed
```

#### 4. Start the Application

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```

#### 5. Login and Test
```
URL: http://localhost:5173
Email: admin@example.com
Password: admin123
```

---

## Feature Testing Checklist

### Enquiry Management
- [ ] Navigate to /enquiries
- [ ] Test search functionality
- [ ] Apply filters (status, activity, market type)
- [ ] Test date range filtering
- [ ] Click "New Enquiry" and create one
- [ ] Edit an enquiry
- [ ] View enquiry details
- [ ] Delete an enquiry

### Reports
- [ ] Navigate to /reports
- [ ] Apply filters
- [ ] Click "Generate Report"
- [ ] Verify summary displays
- [ ] Click "Download Excel"
- [ ] Verify Excel file downloads
- [ ] Click "Download CSV"
- [ ] Verify CSV file downloads

### User Management (Admin only)
- [ ] Navigate to /users
- [ ] Click "Add User"
- [ ] Fill form and create user
- [ ] Edit a user
- [ ] Verify role color coding
- [ ] Test delete (with cancel)

### Profile
- [ ] Navigate to /profile
- [ ] Update name or email
- [ ] Test password change
- [ ] Verify success messages

---

## Known Issues to Watch

1. **If DataGrid doesn't display:**
   - Check browser console for errors
   - Verify `@mui/x-data-grid` is installed
   - Clear cache and restart dev server

2. **If Excel export fails:**
   - Check `exceljs` is installed in server
   - Check browser console and server logs
   - Verify API endpoint is correct

3. **If import script fails:**
   - Verify Excel file is in correct location
   - Check file path in script
   - Review server logs for specific errors

---

## File Locations Reference

### Excel Import File
```
server/data/SALES ENQUIRY TRACKER_Sample data_ 2025-26_VIT Project (1).xls
```

### Environment File
```
server/.env
```

### Logs
```
server/logs/error.log
server/logs/combined.log
```

---

## Quick Troubleshooting

### Backend won't start
```powershell
# Check if port 5000 is in use
netstat -ano | findstr :5000

# If occupied, kill the process or change PORT in .env
```

### Frontend won't start
```powershell
# Check if port 5173 is in use
netstat -ano | findstr :5173

# If occupied, kill the process or change in vite.config.js
```

### MongoDB connection error
```powershell
# Verify MongoDB is running
# Check connection string in .env
# Try connecting with MongoDB Compass first
```

### Dependencies missing
```powershell
# Backend
cd server
rm -rf node_modules package-lock.json
npm install

# Frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

---

## Success Indicators

✅ Backend running on http://localhost:5000  
✅ Frontend running on http://localhost:5173  
✅ Can login with admin credentials  
✅ Dashboard loads with data  
✅ All pages accessible  
✅ No console errors  

---

## Support Resources

1. **Feature Documentation:** `FEATURES_IMPLEMENTED.md`
2. **Setup Guide:** `QUICK_SETUP.md`
3. **Technical Summary:** `IMPLEMENTATION_SUMMARY.md`
4. **This Checklist:** `DEPLOYMENT_CHECKLIST.md`

---

**Status:** Ready for Testing! 🎯  
**Next Step:** Start both servers and test features! 🚀

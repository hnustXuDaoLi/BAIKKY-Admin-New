import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles, CssBaseline } from '@material-ui/core';
import DrawerButtons from'../Components/DrawerButtons';

import {drawerWidth, appBarHeight} from '../Components/appbar-drawer-component/_globals';
import AppBarDrawerComp from '../Components/appbar-drawer-component/AppBarDrawerComp';
import AdminDestination from '../Pages/AdminDestination';
import AdminManagePartner from '../Pages/AdminManagePartner';
import AdminPartnerConfirm from '../Pages/AdminPartnerConfirm';
import AdminPartnerList from '../Pages/AdminPartnerList';
import AdminPartnerType from '../Pages/AdminPartnerType';
import AdminUserList from '../Pages/AdminUserList';
import PartnerAddress from '../Pages/PartnerAddress';
import PartnerBooking from '../Pages/PartnerBooking';
import PartnerDelete from '../Pages/PartnerDelete';
import PartnerDestination from '../Pages/PartnerDestination';
import PartnerEmail from '../Pages/PartnerEmail';
import PartnerFleet from '../Pages/PartnerFleet';
import PartnerPassword from '../Pages/PartnerPassword';
import PartnerProfile from '../Pages/PartnerProfile';
import PartnerUserName from '../Pages/PartnerUserName';
import UserAddress from '../Pages/UserAddress';
import UserBooking from '../Pages/UserBooking';
import UserDelete from '../Pages/UserDelete';
import UserProfile from '../Pages/UserProfile';
import UserUserName from '../Pages/UserUserName';
import UserPassword from '../Pages/UserPassword';
import UserDestination from '../Pages/UserDestination';
import UserEmail from '../Pages/UserEmail';

const useStyles = makeStyles(theme => ({
  root: {
    
  },
  drawerTopComp: {
    margin:theme.spacing(1),
    marginTop:theme.spacing(2),
    font:'bold 16px Arial',
    cursor:"pointer"
  },
  siteBodyMain: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft:drawerWidth
    },
    paddingTop:appBarHeight,
  }
}))

function SiteBody() {
  const loginDetails = JSON.parse(sessionStorage.getItem("loginDetails"));
  const userType = loginDetails.Type;
  const { idPartner }= loginDetails;
  const history = useHistory();
  const page = useParams().page;

  const logout = () => {
    sessionStorage.setItem("loginDetails", null);
    history.push("/");
  }

  const goToPage = page => (
    history.push("/main/" + page)
  );

  const pages = [
    {p:'0', pageComp:() => <UserProfile/>},
    {p:'1', pageComp:() => <UserUserName/>},
    {p:'2', pageComp:() => <UserEmail/>},
    {p:'3', pageComp:() => <UserPassword/>},
    {p:'4', pageComp:() => <UserAddress/>},
    {p:'6', pageComp:() => <UserBooking/>},
    {p:'7', pageComp:() => <UserDestination/>},
    {p:'8', pageComp:() => <UserDelete/>},
    {p:'9', pageComp:() => <AdminManagePartner/>},
    {p:'10', pageComp:() => <AdminPartnerList/>},
    {p:'11', pageComp:() => <AdminUserList/>},
    {p:'12', pageComp:() => <AdminPartnerConfirm/>},
    {p:'13', pageComp:() => <AdminPartnerType/>},
    {p:'14', pageComp:() => <AdminDestination/>},
    {p:'16', pageComp:() => <PartnerProfile/>},
    {p:'17', pageComp:() => <PartnerUserName/>},
    {p:'18', pageComp:() => <PartnerEmail/>},
    {p:'19', pageComp:() => <PartnerPassword/>},
    {p:'20', pageComp:() => <PartnerAddress/>},
    {p:'21', pageComp:() => <PartnerFleet/>},
    {p:'22', pageComp:() => <PartnerBooking/>},
    {p:'23', pageComp:() => <PartnerDestination/>},
    {p:'24', pageComp:() => <PartnerDelete/>},
  ]

  const userButtons = [
    {p:'0',label:'Change Profile'},
    {p:'1',label:'Change User Name'},
    {p:'2',label:'Change Email'},
    {p:'3',label:'Change Password'},
    {p:'4',label:'Change Address'},
    {isDivider:true},
    {p:'6',label:'Manage Quotations'},
    {isDivider:true},
    {p:'7',label:'Rate Destinations'},
    {isDivider:true},
    {p:'8',label:'Delete Account'},
    {isDivider:true},
  ]

  const adminPartnerButtons = [
    {p:'9',label:'Manage Partners', rights:['10','11']},
    {p:'10',label:'List Partners', rights:['10','11']},
    {p:'11',label:'List Users', rights:['10','11']},
    {p:'12',label:'Confirm a Partner', rights:['11']},
    {p:'13',label:'Change Partner Type', rights:['10','11']},
    {isDivider:true, rights:['10','11']},
    {p:'14',label:'Destinations', rights:['10','11']},
    {isDivider:true, rights:['10','11']},
    {p:'20',label:'Change Address', rights:['11']},
    {isDivider:true, rights:['11']},
  ]

  const partnerButtons = [
    {p:'16',label:'Change Profile', rights:['11','60','91']},
    {p:'17',label:'Change User Name', rights:['11','60','91']},
    {p:'18',label:'Change Email', rights:['11','60','91']},
    {p:'19',label:'Change Password', rights:['60','91']},
    {p:'20',label:'Change Address', rights:['11','60']},
    {isDivider:true, rights:['11','60','91']},
    {p:'21',label:'Update Fleet', rights:['60']},
    {p:'22',label:'Manage Quotations', rights:['60']},
    {p:'23',label:'Manage Destinations', rights:['11','60']},
    {isDivider:true, rights:['11','60']},
    {p:'24',label:'Delete Account', rights:['60','91']},
    {isDivider:true, rights:['60','91']},
  ]

  // select the list of buttons depending on the user type and access rights
  let buttons = [];
  if(userType === 'user') buttons = userButtons;
  else if(userType === 'partner' && idPartner === '1') {
    buttons = adminPartnerButtons.filter(button => 
      button.rights.includes(loginDetails.PartnerUserRight)
    );
  }
  else if(userType === 'partner') {
    buttons = partnerButtons.filter(button => 
      button.rights.includes(loginDetails.PartnerUserRight)
    );
  }

  // choose which button was selected
  // and set the onclick function for each button
  buttons.forEach(button => {
    button.onClick = () => goToPage(button.p)
    if(button.p === page) button.isSelected = true;
  })

  // add a logout button to the list
  buttons.push(
    {p:'9',label:'Logout', onClick:logout},
    {isDivider:true},
  )

  useEffect(() => {
    if(!page) buttons[0].onClick();
  }, [page, buttons])

  return (
    <div>
      <CssBaseline />
      <SiteBodyFrame
        buttons={buttons}
        returnToHome={() => history.push("/")}
      />
      <SiteBodyMain
        currentPage={pages.find(_page => _page.p === page)}
      />
    </div>
  );
}

function SiteBodyFrame(props) {
  const classes = useStyles();
  const {buttons, returnToHome} = props;
  return (
    <div>
      <AppBarDrawerComp
        appBarProps={{
          backgroundColor:'rgba(232, 232, 232, 0.4)'
        }}
        drawerChildren={
          <DrawerButtons buttons={buttons}/>
        }
        drawerProps={{
          drawerTopComponents:[
            <div 
              key={0} 
              className={classes.drawerTopComp}
              onClick={() => returnToHome()}
            >
              BaikUp
            </div>
          ]
        }}
      />
    </div>
  );
}

function SiteBodyMain(props) {
  const classes = useStyles();
  const {currentPage} = props;
  return (
    <main className={classes.siteBodyMain}>
      {currentPage ? 
        currentPage.pageComp() : 'Page Not Found'
      }
    </main>
  )
}

export default SiteBody;

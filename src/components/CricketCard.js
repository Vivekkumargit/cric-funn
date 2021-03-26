import React, { useState, useContext, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { flattenDeep, map, find } from 'lodash';

import kkrLogo from '../images/kkr.png';
import rcbLogo from '../images/rcb.png';
import srhLogo from '../images/srh.png';
import cskLogo from '../images/csk.png';
import dcLogo from '../images/dc.png';
import rrLogo from '../images/rr.png';
import miLogo from '../images/mi.png';
import pkLogo from '../images/pk.png';
import vsLogo from '../images/vs.png';
import backGround from '../images/background.jpg';
import MatchDetails from './MatchDetails';
import { getMatchDetails } from './apis';
import BettingDialog from './BettingDialog';
import { ContextProvider } from '../Global/Context';

// date: "2021-04-09T00:00:00.000Z"
// dateTimeGMT: "2021-04-09T14:00:00.000Z"
// matchStarted: false
// squad: true
// team1Abbreviation: "MI"
// team2Abbreviation: "RCB"
// team-1: "Mumbai Indians"
// team-2: "Royal Challengers Bangalore"
// type: ""
// unique_id: 1254058
function CricketCard(props) {
    const { mobileView, match = {} } = props;
    const contextConsumer = useContext(ContextProvider);
    const { loggedInUserDetails } = contextConsumer;
    const { bets = [] } = loggedInUserDetails;
    const { dateTimeGMT: matchTime, toss_winner_team: tossWinnerTeam, winner_team: winnerTeam, team1Abbreviation, team2Abbreviation, "team-1": team1, "team-2": team2, unique_id } = match;
    const [bettingDoneByUser, setBettingDoneByUser] = useState(false);
    const team1Logo = getTeamLogo(team1Abbreviation);
    const team2Logo = getTeamLogo(team2Abbreviation);
    const [openDialogBox, setOpenDialogBox] = useState(false);
    const [openBettingDialog, setOpenBettingDialog] = useState(false);
    const [matchDetails, setMatchDetails] = useState({});
    const betStartTime = moment(matchTime).subtract(24.5,"hours");
    const betEndTime = moment(matchTime).subtract(30,"minutes");
    const [bettingOn, setBettingOn] = useState(moment() >= betStartTime && moment() <= betEndTime && !bettingDoneByUser);
    const [message, setMessage] = useState(moment() >= betEndTime ? `Betting for this match is CLOSED.` : `Betting for this match will be OPENED from ${betStartTime.format("LLL")} to ${betEndTime.format("LLL")}`);
    const [severity, setSeverity] = useState("info");
    const [matchDetailsLoading, setMatchDetailsLoading] = useState(false);

    const root = {
        width: mobileView ? '100%' : '70%',
        marginBottom: "50px"
    };
    const media = {
        height: 300
    };
    const backgroundImage = {
      backgroundImage: `url(${backGround})`, 
      backgroundRepeat:"no-repeat", 
      backgroundSize: "100% 90%",
      height: 200
    };

    useEffect(()=> {
      const bettingDone = flattenDeep(map(bets, "unique_id")).includes(unique_id);
      setBettingDoneByUser(bettingDone);
      setBettingOn(moment() >= betStartTime && moment() <= betEndTime && !bettingDone);

      if(moment() < betStartTime) {
        setMessage(`Betting for this match will be OPENED from - ${betStartTime.format("LLL")} TO ${betEndTime.format("LLL")}`);
        setSeverity("info");
      } else if(moment() >= betStartTime && moment() <= betEndTime) {
        setMessage(`Betting is OPENED TILL - ${betEndTime.format("LLL")}.`);
        setSeverity("success");
        if(bettingDone) {
          const bet = find(bets, {"unique_id": unique_id}) || {};
          setMessage(`You've bet ${bet.selectedPoints} POINTS on this match.`);
          setSeverity("warning");
        }
      } else {
        setMessage(`Betting for this match is CLOSED. You DID NOT bet.`);
        setSeverity("error");
        if(bettingDone) {
          const bet = find(bets, {"unique_id": unique_id}) || {};
          if(bet.isSettled) {
            if(bet.betWon) {
              setMessage(`Betting CLOSED. You WON ${bet.selectedPoints} POINTS on this match.`);
              setSeverity("success");
            } else {
              setMessage(`Betting CLOSED. You LOST ${bet.selectedPoints} POINTS on this match.`);
              setSeverity("error");
            }
          } else {
            setMessage(`Betting CLOSED. You bet ${bet.selectedPoints} POINTS on this match.`);
            setSeverity("warning");
          }
        }
      }
      
    },[bets]);

    const handleClose = () => {
      setOpenDialogBox(false);
    }

    const handleCloseBetting = () => {
      setOpenBettingDialog(false);
    }

    const handleClick = (id) => {
      setOpenDialogBox(true);
      setMatchDetailsLoading(true);
      getMatchDetails(id)
        .then(data => {
          setMatchDetails(data);
          setMatchDetailsLoading(false);
        })
        .catch(err => {
          console.log(err);
          setMatchDetailsLoading(false);
        })
    }

    const handleBetClick = () => {
      setOpenBettingDialog(true);
    }

    function getTeamLogo(team) {
      if(team == "SRH") return srhLogo;
      else if(team == "KKR") return kkrLogo;
      else if(team == "DC") return dcLogo;
      else if(team == "CSK") return cskLogo;
      else if(team == "MI") return miLogo;
      else if(team == "KXIP") return pkLogo;
      else if(team == "RCB") return rcbLogo;
      else return rrLogo;
    }

    return (
      <>
        <Card style={root}>
          <CardActionArea>
            <CardContent>
              <Grid container justify="center" spacing={4} alignContent="center" style={backgroundImage}>
                <Grid item>
                  <img src={team1Logo} style={{width: mobileView ? 110 : 150}}/>
                </Grid>
                
                <Grid item>
                  <img src={vsLogo} style={{width: mobileView ? 75 : 150}}/>
                </Grid>
                
                <Grid item>
                  <img src={team2Logo} style={{width: mobileView ? 110 : 150}}/>  
                </Grid>  
              </Grid>
              <Typography gutterBottom variant="h5" component="h2">
                <b>{team1} VS {team2}</b>
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Start Time: {moment(matchTime).format("LLL")}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button size="small" color="primary" variant="contained" onClick={() => handleClick(unique_id)}>
              Match Details
            </Button>
            <Button size="small" color="primary" variant="contained" disabled={!bettingOn} onClick={() => handleBetClick()}>
              Let's Bet!
            </Button>
          </CardActions>
          <Alert severity={severity}>
            {message}
          </Alert>
        </Card>
        <MatchDetails matchDetailsLoading={matchDetailsLoading} matchDetails={matchDetails} toss={tossWinnerTeam} winnerTeam={winnerTeam} open={openDialogBox} handleClose={handleClose} team1Abbreviation={team1Abbreviation} team2Abbreviation={team2Abbreviation}/>
        <BettingDialog matchDetails={match} open={openBettingDialog} betEndTime={betEndTime} handleBettingCloseDialog={handleCloseBetting}/>
      </>
    );
}

export default CricketCard;

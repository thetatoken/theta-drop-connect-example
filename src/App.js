import React from 'react';
import {ThetaDropConnect} from '@thetalabs/theta-drop-connect';
import './App.css';

const AppId = 'dapp_8gsf5446h44rsrpyun0pu5qqztm';
const redirectURL = 'http://localhost:3010/thetadrop-auth-finished.html';

const ThetaZillaMarketplaceUrl = 'https://thetazilla.thetadrop.com/content/type_2s2kcznsu3e06en43r3kg50b90c';
const ThetaZillaId = 'type_2s2kcznsu3e06en43r3kg50b90c';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.thetaDrop = new ThetaDropConnect();

    this.state = {
      isOwner: false
    }
  }

  componentDidMount() {
    // Optional: Use only if using the redirect option
    this.finishConnectViaRedirect();
  }

  finishConnectViaRedirect = async () => {
    const result =  await this.thetaDrop.finishConnectViaRedirect();

    if(result){
      const {snsId, oauth2Token} = result;

      this.setState({
        tpsId: snsId,
        authToken: oauth2Token
      });

      this.refreshUser();
      this.refreshOwnershipChecks();
    }
  }

  refreshOwnershipChecks = async () => {
    const filters = {
      content_id: ThetaZillaId
    };
    await this.thetaDrop.fetchUserNFTs(filters);

    const isOwner = await this.thetaDrop.checkUserIsOwner(filters);

    this.setState({
      isOwner: isOwner
    });
  }

  refreshUser = async () => {
    const userData = await this.thetaDrop.fetchUser();

    this.setState({
      userData: userData
    });
  }

  connectToThetaDrop = async () => {
    const {snsId, oauth2Token} = await this.thetaDrop.connectViaPopup(AppId, redirectURL);

    this.setState({
      tpsId: snsId,
      authToken: oauth2Token
    });

    this.refreshUser();
    this.refreshOwnershipChecks();
  };

  connectToThetaDropViaRedirect = async () => {
    const hostUri = 'http://localhost:3010';
    this.thetaDrop.connectViaRedirect(AppId, hostUri);
  };

  render(){
    const {userData, isOwner} = this.state;

    return (
        <div className="App">
          <header className="App-header">
            <h2>
              ThetaDrop Connect Playground
            </h2>

            {
              userData &&
              <div>
                <div style={{marginBottom: 12}}>Logged in as:</div>
                <img src={userData.avatar_url}
                     style={{width: 100}}
                />
                <div style={{fontSize: 12}}>{userData.display_name}</div>
                  <div style={{fontSize: 10}}>{`@${userData.username}`}</div>
              </div>
            }

            {
              userData === undefined &&
              <div>
                <h3>Connect to ThetaDrop</h3>
                <p>Login to connect</p>
                <button onClick={this.connectToThetaDrop}>Login to ThetaDrop via Popup</button>
                <button onClick={this.connectToThetaDropViaRedirect}>Login to ThetaDrop via Redirect</button>
              </div>
            }

            {
              userData !== undefined && !isOwner &&
              <div>
                <h3>Sorry...Owners Only Area</h3>
                <a href={ThetaZillaMarketplaceUrl} target={'_blank'}>Buy a ThetaZilla</a>
              </div>
            }

            {
              isOwner &&
              <div>
                <h3>Owners Only Area</h3>
                <button onClick={() => {
                  alert('Hello Owner :)')
                }}>Owners Only Lounge</button>
              </div>
            }

          </header>
        </div>
    );
  }
}

export default App;

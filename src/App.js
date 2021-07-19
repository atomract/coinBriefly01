import React  from 'react';
import './App.css';
import img from './img.svg'
function App() {
  return (
    <div className=''>
   <div className="container ">
     <div className='row'> 
     <div className='col-md-8 mx-auto'>
   

  
    <div className="d-flex navBar">
      <div className="svglogo">
        <img  src={img} />
      </div>
     
      <h1 className="dis">disperse <sup className="mai">mainnet</sup></h1>
      <div>
      <a className="etherscan  ms-4" href="#">etherscan</a> 
      <a  className="telegram ms-4" href="#">telegram</a>
      </div>
    
    
     
    </div>
      
      <p className="mt-3 verbline"><em>verb</em> distribute ether or tokens to multiple addresses</p>
    <div>
      <h2 className="connect"><em >connect to wallet</em></h2>
      <p className="logged">logged in as 0x922a08893a1ca18a5b899d048ce66aa35287f249</p>
      <h4 className="send">send <em><a className="text" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">ether</a></em> or <em><span className="text" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample" >  token</span></em></h4>
      </div>
    <div class="collapse" id="collapseExample">
    <p className="ETH pt-4">you have 0.0 ETH</p>
    <div> 
      <h2 className="amounts">token address</h2>
    </div>
    <div>
      <p className="line pt-3">enter one address and amount in ETH on each line. supports any format.</p>
    </div>
    <div>
    <textarea useRef="addresses" spellcheck="false" placeholder="0x314ab97b76e39d63c78d5c86c2daf8eaa306b182 3.141592
0x271bffabd0f79b8bd4d7a1c245b7ec5b576ea98a,2.7182
0x141ca95b6177615fb1417cf70e930e102bf8f584=1.41421"></textarea>
    </div>
 </div>
     </div>
     

     </div>

   </div>
    </div>

  );
}

export default App;

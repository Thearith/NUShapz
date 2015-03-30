# NUShapz
IVLE Event Web Application

Go to https://drive.google.com/drive/#folders/0B3VJI1Sg8Z0LaTVrbFpERVdsbnM for more details

<b>Project Description:</b>

“NUShapz” brings students together to discover the latest NUS happenings and events as a community. Building on the concept of unity in diversity, we aim to showcase the vibrancy that the NUS campus life has to offer and allow students to more effectively reach out and invite their friends to join them in whatever they do. In not limiting to just official school events, we create opportunities for increase participation and awareness of anything that is fun and enriching within NUS.

<b>Objective(s):</b>

A one-stop service for anything NUS
(eg. CCA Welcome Tea, Community Service Program, Special Seminars, Hobbyist Events even your self-organised Captain Ball’s Game on Utown Green) list in non-exhaustive.

Dashboard to curate and monitor new events posting. 

<b>Technology:</b><br/>
<ul>
  <li>
  <i>Front-end:</i> 
    <ol>
      <li>HTML CSS, Javascript</li>
      <li>Bootstrap</li>
      <li>Font-awesome</li>
      <li>Flexbox</li>
    </ol>
  </li>
  <br/>
  <li>
  <i>Back-end: </i>
    <ol>
      <li>PHP</li>
      <li>MySQL</li>
    </ol>
  </li>
  <br/>
  <li>
  <i>Misc:</i>
    <ol>
      <li>Hosting: Sunfire Server </li>
      <li>Domain: Godaddy.com</li>
      <li>Github</li>
    </ol>
  </li>
</ul>

<h5> Connecting to AWS </h5>
<h6> SSH via terminal </h6>
<p> Run ssh -i nushapz.pem ec2-user@52.74.127.35 with nushapz.pem place in currently working directory </p>
<h6> PuTTy (Windows) </h6>
<p> Run PuTTy, set ip as 52.74.127.35, set nushapz.ppk key under Auth/SSH, connect as ec2-user. </p>
<h6> AWS working directory </h6>
<p> cd /var/www/html </p>
<h6> Adding files to AWS via FileZilla </h6>
<p> Set host as 52.74.127.35, protocol: STFP, logon type interactive, user: ec2-user and add keyfile(nushapz.ppk) in Settings/FTP/SFTP </p>
<p> Upload files in /var/www/html/ </p>




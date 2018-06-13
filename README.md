# Flame_ws

Flame_ws provides a simple web interface for managing existing models and running predictions. 

Flame_ws is in active development and **no stable release has been produced so far**. Even this README is under construction, so please excuse errors and inaccuracies.

## Installing
Flame_ws asumes that Flame (https://github.com/phi-grib/flame) is already installed and reachable in the *PYTHONPATH*. In development environments where Flame is installed in another location, the full path must be defined (hardcoded) at the top of file `flame_ws.py`. 

The server is started by typing:

```sh
python flame-ws.py 
```	

To access the web graphical interface, open a web brower and enter the address *http://localhost:8081*

The web page contains two tabs

### Manage

![Alt text](images/flame-ws-manage.png?raw=true "manage tab")

The page is divided in three regions:
* Models available. A list of existing models and versions, in an expandable tree
* Model details. A detailed description of the model selected in the model tree view
* Tools. A toolbox with commands which can be executed

| Command | Equivalent Flame command | Description |
| --- | --- | ---|
| Clone | *python -c manage -a publish -e NEWMODEL* | Clones the development version, creating a new version in the model repository. Versions are assigned sequential numbers |
| Export | *python -c manage -a export -e NEWMODEL* | Exports the model entry NEWMODE, creating a tar compressed file *NEWMODEL.tgz* which contains all the versions. |
| Delete Model| *python -c manage -a kill -e NEWMODEL* | Removes NEWMODEL from the model repository. **Use with extreme care**, since the removal will be permanent and irreversible  |
| Delete Version | *python -c manage -a remove -e NEWMODEL -v 2* | Removes the version specified from the NEWMODEL model repository |
| New model | *python -c manage -a new -e NEWMODEL* | Creates a new entry in the model repository  |
| Import | *python -c manage -a import -e NEWMODEL* | Imports file *NEWMODEL.tgz*, creating model NEWMODEL in the local model repository |

### Predict

![Alt text](images/flame-ws-predict.png?raw=true "predict tab")

Select a SDFile in the *Input* field, using the browse button. Select the *model* and *version* and press the *Predict* button. After a short while, the results are shown in tabular format.

Results can be exported to a .tsv formatted file pressing the *Export* button.


## API

Web API services available:

(in development)

| URL | HTTP verb | Input data | Return data | HTTP status codes |
| --- | --- | --- | --- | --- |
| /info | GET | | application/json: info_message response | 200 |
| /dir | GET | | application/json: available_services response | 200 |
| /predict | POST | multipart/form-data encoding: model and filename | application/json: predict_call response | 200, 500 for malformed POST message |

The exact synthax of the JSON object returned by predict will be documented in detail elsewhere.


## Licensing

Flame was produced at the PharmacoInformatics lab (http://phi.upf.edu), in the framework of the eTRANSAFE project (http://etransafe.eu). eTRANSAFE has received support from IMI2 Joint Undertaking under Grant Agreement No. 777365. This Joint Undertaking receives support from the European Union’s Horizon 2020 research and innovation programme and the European Federation of Pharmaceutical Industries and Associations (EFPIA). 

![Alt text](images/eTRANSAFE-logo-git.png?raw=true "eTRANSAFE-logo") ![Alt text](images/imi-logo.png?raw=true "IMI logo")

Copyright 2018 Manuel Pastor (manuel.pastor@upf.edu)

Flame is free software: you can redistribute it and/or modify it under the terms of the **GNU General Public License as published by the Free Software Foundation version 3**.

Flame is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Flame. If not, see <http://www.gnu.org/licenses/>.


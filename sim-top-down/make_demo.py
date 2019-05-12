#!/usr/bin/env python3

import sys
import os
import os.path

import ctools
import ctools.tydoc as tydoc
from tydoc import TyTag

TABLE_STYLE="""

#bbox {
 height: 200px;
}

#barrier {
  width: 50px;
  transform: rotate(-90deg);
  font-weight: bold;
  font-family: sans-serif;
  font-size: 20pt;
  position: relative;
  top: 60px;
  left: 10px;
}

tr {border-style: solid;}
td {border-style: solid;}
table {
  font-size: 11pt;
  font-family: sans-serif;
  text-align: center;
  border-collapse: collapse;
}

input {
  text-align: right;
  font-weight: bold;
  font-size: 12pt;
}

.data {
   font-family: monospace;
}

.column {
  float: left;
  padding: 5px; 
}

.noise {
  background-color: yellow;
}


/*
.left, .right {
  width: 40%; 
}
*/

.middle {
//  width: 10%; 
padding: 4px;
height: 250px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}


"""
class MatrixMaker:
    def __init__(self,id_prefix):
        self.id_prefix = id_prefix

    def pop_data_field(self, name, level, f=None, m=None ):
        dd = TyTag('span', text='tbd', attrib={'class':'data', 'id':self.id_prefix+level})
        if m is not None:
            attrib = {'type':'text', 'size':'3'}
            df = TyTag('input',attrib={**attrib,**{'value':str(m)}})
            dm = TyTag('input',attrib={**attrib,**{'value':str(f)}})
        else:
            attrib = {'class':'data'}
            df = TyTag('span', text='tbd', attrib={**attrib, **{'id':self.id_prefix+level+'f'}})
            dm = TyTag('span', text='tbd', attrib={**attrib, **{'id':self.id_prefix+level+'m'}})
        return [ name + ' pop: ', dd, '<br/>', 
                 '<span class="data">f:</span>', df, '<br/>',
                 '<span class="data">m:</span>', dm]

    def add_matrix(self,doc):

        t = tydoc.tytable()
        doc.append(t)

        tr = t.tbody.add_tag('tr')
        tr.add_tag('td', *self.pop_data_field('Any State', 'state'), attrib={'colspan':6})
        tr = t.tbody.add_tag('tr')
        tr.add_tag('td', *self.pop_data_field('Farmland ', 'fcounty'),   attrib={'colspan':3})
        tr.add_tag('td', *self.pop_data_field('Urbanville', 'ucounty'), attrib={'colspan':3})
        tr = t.tbody.add_tag('tr')
        tr.add_tag('td', *self.pop_data_field('FBlock<br/>', 'b1', f=1,   m=2))
        tr.add_tag('td', *self.pop_data_field('FBlock<br/>', 'b2', f=10,  m=15))
        tr.add_tag('td', *self.pop_data_field('FBlock<br/>', 'b3', f=25,  m=10))
        tr.add_tag('td', *self.pop_data_field('UBlock<br/>', 'b4', f=350, m=330))
        tr.add_tag('td', *self.pop_data_field('UBlock<br/>', 'b5', f=750, m=800))
        tr.add_tag('td', *self.pop_data_field('UBlock<br/>', 'b6', f=925, m=975))
        return t

if __name__=="__main__":
    doc = tydoc.tydoc()
    doc.head.add_tag("style",TABLE_STYLE)
    div = doc.body.add_tag("div", attrib={'class':'row'})
    col1 = div.add_tag('div', attrib={'class':'column left'})
    col2 = div.add_tag('div', attrib={'class':'column middle noise'})
    col3 = div.add_tag('div', attrib={'class':'column right'})
                                      
    MatrixMaker('r').add_matrix(col1)
    col2.add_tag('p',
                 '<div id="bbox"><div id="barrier">Noise Barrier</div></div>',
                 '<button>privitize!</button><br/>')
    MatrixMaker('p').add_matrix(col3)
    doc.save("demo.html")
    

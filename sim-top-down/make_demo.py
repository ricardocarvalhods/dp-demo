#!/usr/bin/env python3

import sys
import os
import os.path

import ctools
import ctools.tydoc as tydoc
from tydoc import TyTag

LOCALHOST_CDN = False
LOCAL_CDN = False
REQUIRED = ['https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css',
            'https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js',
            'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js',
            'demo.js']

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

.ruralblock {
  background-color: rgb(0,255,0);
}

.ruralcounty {
  background-color: rgb(128,255,128);
}

.urbanblock {
  background-color: rgb(128,128,255);
}

.urbancounty {
  background-color: rgb(192,192,255);
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
    def __init__(self,id_prefix,editable=True):
        self.id_prefix = id_prefix
        self.editable  = editable;

    def pop_data_fields(self, name, level, f=None, m=None ):
        d1 = TyTag('div', attrib={'class':'dataline'})
        d1t = TyTag('span', text=f'{name} pop: ', attrib={'class':'datalabel'})
        d1d = TyTag('span', text='tbd', attrib={'class':'data', 'id':self.id_prefix+level+"-pop"})
        d1.extend([d1t,d1d])

        d2 = TyTag('div', attrib={'class':'dataline'})
        d2t = TyTag('span', text='f: ', attrib={'class':'datalabel'})
        
        d3 = TyTag('div', attrib={'class':'dataline'})
        d3t = TyTag('span', text='m: ', attrib={'class':'datalabel'})
        
        if self.editable==True and 'Block' in name:
            attrib = {'type':'text', 'min':'0', 'max':'999', 'size':'3', 'class':'data'}
            d2d = TyTag('input',            attrib={**attrib, **{'id':self.id_prefix+level+'-f', 'value':'0'}})
            d3d = TyTag('input',            attrib={**attrib, **{'id':self.id_prefix+level+'-m', 'value':'0'}})
        else:
            attrib = {'class':'data'}
            d2d = TyTag('span', text='tbd', attrib={**attrib, **{'id':self.id_prefix+level+'-f'}})
            d3d = TyTag('span', text='tbd', attrib={**attrib, **{'id':self.id_prefix+level+'-m'}})

        d2.extend([d2t,d2d])
        d3.extend([d3t,d3d])

        return [ d1, d2, d3 ]

    def add_matrix(self,doc):
        t = tydoc.tytable()
        tr = t.tbody.add_tag('tr')
        tr.add_tag_elems('td', self.pop_data_fields('Any State', 'state'),    attrib={'colspan':'6'})
        tr = t.tbody.add_tag('tr')
        tr.add_tag_elems('td', self.pop_data_fields('Ruralland ', 'rcounty'),  attrib={'colspan':'3', 'class':'ruralcounty'})
        tr.add_tag_elems('td', self.pop_data_fields('Urbanville', 'ucounty'), attrib={'colspan':'3', 'class':'urbancounty'})
        tr = t.tbody.add_tag('tr')
        tr.add_tag_elems('td', self.pop_data_fields('RBlock<br/>', 'b1'), attrib={'class':'ruralblock'})
        tr.add_tag_elems('td', self.pop_data_fields('RBlock<br/>', 'b2'), attrib={'class':'ruralblock'})
        tr.add_tag_elems('td', self.pop_data_fields('RBlock<br/>', 'b3'), attrib={'class':'ruralblock'})
        tr.add_tag_elems('td', self.pop_data_fields('UBlock<br/>', 'b4'), attrib={'class':'urbanblock'})
        tr.add_tag_elems('td', self.pop_data_fields('UBlock<br/>', 'b5'), attrib={'class':'urbanblock'})
        tr.add_tag_elems('td', self.pop_data_fields('UBlock<br/>', 'b6'), attrib={'class':'urbanblock'})

        doc.append(t)
        return t

if __name__=="__main__":
    doc = tydoc.tydoc()
    doc.head.add_tag_text("style",TABLE_STYLE)
    # https://developers.google.com/speed/libraries/#jquery

    for url in REQUIRED:
        # Check if we should use our phantom CDN
        if url.startswith('https:'):
            if LOCALHOST_CDN:
                url = 'http://localhost/cdn/' + os.path.basename(url)
            elif LOCAL_CDN:
                url = 'cdn/' + os.path.basename(url)

        if url.endswith('.css'):
            doc.head.add_tag("link",   attrib={'rel':'stylesheet','src':url})
        elif url.endswith('.js'):
            doc.head.add_tag("script", attrib={'src':url})
        else:
            raise RuntimeError("Unknown file type: "+url)


    div = doc.body.add_tag("div", attrib={'class':'row'})
    col1 = div.add_tag('div', attrib={'class':'column left'})
    col2 = div.add_tag('div', attrib={'class':'column middle noise'})
    col3 = div.add_tag('div', attrib={'class':'column right'})
                                      
    MatrixMaker('r', editable=True).add_matrix(col1)
    col2.text=('<p>'
               '<div id="bbox"><div id="barrier">Noise Barrier</div></div>'
               '<button>privitize!</button><br/>'
               '&epsilon; <select name="epsilon" id="epsilon">'
               '<option>0.5</option>'
               '<option selected="selected">1.0</option>'
               '<option>2.0</option>'
               '</select>'
               '</p>' )
    MatrixMaker('p', editable=False).add_matrix(col3)
    doc.save("demo.html")
    

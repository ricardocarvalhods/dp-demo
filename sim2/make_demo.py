#!/usr/bin/env python3

import sys
import os
import os.path

import ctools
import ctools.tydoc as tydoc
from tydoc import TyTag

TABLE_STYLE="""
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
"""
def mf_input_fields():
    inattrib = {'type':'text',
                'size':'5'}
    return [TyTag('input',attrib=inattrib),'<br>(m)<br>', TyTag('input',attrib=inattrib), '<br>(f)' ]

def add_matrix(doc):

    t = doc.table()
    tr = t.tbody.add_tag('tr')
    tr.add_tag('td','Any State', attrib={'colspan':6})
    tr = t.tbody.add_tag('tr')
    tr.add_tag('td', mf_input_fields(), attrib={'colspan':6})
    tr = t.tbody.add_tag('tr')
    tr.add_tag('td','Farmland pop: 10',  attrib={'colspan':3})
    tr.add_tag('td','Urbanville pop: 20',attrib={'colspan':3})
    tr = t.tbody.add_tag('tr')
    tr.add_tag('td', mf_input_fields(), attrib={'colspan':3})
    tr.add_tag('td', mf_input_fields(), attrib={'colspan':3})
    tr = t.tbody.add_tag('tr')
    tr.add_tag('td','FBlock<br>pop: 5')
    tr.add_tag('td','FBlock<br>pop: 6')
    tr.add_tag('td','FBlock')
    tr.add_tag('td','UBlock')
    tr.add_tag('td','UBlock')
    tr.add_tag('td','UBlock')
    tr = t.tbody.add_tag('tr')
    tr.add_tag('td', mf_input_fields())
    tr.add_tag('td', mf_input_fields())
    tr.add_tag('td', mf_input_fields())
    tr.add_tag('td', mf_input_fields())
    tr.add_tag('td', mf_input_fields())
    tr.add_tag('td', mf_input_fields())
    
    return t

if __name__=="__main__":
    doc = tydoc.tydoc()
    doc.head.add_tag("style",TABLE_STYLE)
    t = add_matrix(doc)
    doc.save("foo.html")
    

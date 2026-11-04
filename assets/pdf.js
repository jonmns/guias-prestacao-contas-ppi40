/* Exportador PDF local, sem rede: texto WinAnsi, paginação A4 e quebra de linhas. */
(function(){'use strict';
 function bytes(s){var extra={'€':128,'‘':145,'’':146,'“':147,'”':148,'–':150,'—':151,'•':149};return Uint8Array.from(Array.from(s,c=>extra[c]|| (c.charCodeAt(0)<=255?c.charCodeAt(0):63)));}
 function literal(s){return String(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');}
 window.PortalPDF=function(title,lines,filename){
  var all=[title,'Emitido em '+new Date().toLocaleString('pt-BR'),''];
  lines.forEach(function(line){var words=String(line).replace(/\s+/g,' ').split(' '),out='';words.forEach(function(w){while(w.length>88){if(out){all.push(out);out='';}all.push(w.slice(0,88));w=w.slice(88);}if((out+' '+w).length>88){all.push(out);out=w;}else out+=(out?' ':'')+w;});all.push(out);});
  var chunks=[];for(var i=0;i<all.length;i+=46)chunks.push(all.slice(i,i+46));
  var objs=['<< /Type /Catalog /Pages 2 0 R >>','', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'],kids=[];
  chunks.forEach(function(page,n){var id=objs.length+1,content=id+1;kids.push(id+' 0 R');objs.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents '+content+' 0 R >>');var stream='BT /F1 11 Tf 48 790 Td 15 TL\n'+page.map(x=>'('+literal(x)+') Tj T*').join('\n')+'\n(\u0050agina '+(n+1)+' de '+chunks.length+') Tj\nET';objs.push('<< /Length '+bytes(stream).length+' >>\nstream\n'+stream+'\nendstream');});
  objs[1]='<< /Type /Pages /Count '+kids.length+' /Kids ['+kids.join(' ')+'] >>';
  var doc='%PDF-1.4\n',offset=[0];objs.forEach(function(o,i){offset.push(bytes(doc).length);doc+=(i+1)+' 0 obj\n'+o+'\nendobj\n';});var xref=bytes(doc).length;doc+='xref\n0 '+(objs.length+1)+'\n0000000000 65535 f \n'+offset.slice(1).map(x=>String(x).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<< /Size '+(objs.length+1)+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF';
  var url=URL.createObjectURL(new Blob([bytes(doc)],{type:'application/pdf'})),a=document.createElement('a');a.href=url;a.download=filename||'relatorio-ppi40.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
 };
})();

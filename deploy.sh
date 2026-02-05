#!/bin/bash
# Deploy static build to Bluehost

lftp -u "ftpUser@rickwphillips.com,foh{^lG5~5*f" ftp://ftp.rickwphillips.com -e "
set ssl:verify-certificate no
mirror -R --verbose --delete /Users/rick/FreddyRhetorickProjects/commander-collector/out/ public_html/app/projects/commander/
bye
"

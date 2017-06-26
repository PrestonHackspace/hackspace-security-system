#!/bin/bash

if [[ "$OSTYPE" == "linux-gnu" ]]; then
  md5=$(echo $1 | md5sum | awk '{ print $1 }')

  if [ ! -f /tmp/$md5.wav ]; then
    echo 'Generating speech...'
    pico2wave -w /tmp/$md5.wav "$1"
  fi

  aplay /tmp/$md5.wav
elif [[ "$OSTYPE" == "darwin"* ]]; then
  say $1
elif [[ "$OSTYPE" == "cygwin" ]]; then
  echo $1
elif [[ "$OSTYPE" == "msys" ]]; then
  echo $1
elif [[ "$OSTYPE" == "win32" ]]; then
  echo $1
elif [[ "$OSTYPE" == "freebsd"* ]]; then
  echo $1
else
  echo $1
fi
